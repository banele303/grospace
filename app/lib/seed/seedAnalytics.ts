import { db as prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { addDays, subDays, format, setHours, setMinutes, setSeconds } from "date-fns";

// Types for analytics seeding
interface SeedOptions {
  days?: number;
  vendorId?: string;
  clearExisting?: boolean;
  includeProducts?: boolean;
  includeOrders?: boolean;
  includeViews?: boolean;
  includeUsers?: boolean;
}

/**
 * Generate random number between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random date within a range
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Get random element from array
 */
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Create a growth trend with some randomness
 */
function generateTrendSeries(days: number, startValue: number, growth: number, volatility: number): number[] {
  const series: number[] = [startValue];
  
  for (let i = 1; i < days; i++) {
    // Base growth
    const baseGrowth = 1 + (growth / 100);
    // Random volatility
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    // Previous value
    const prev = series[i - 1];
    // New value with growth and volatility
    const newValue = Math.max(0, prev * baseGrowth * randomFactor);
    
    series.push(Math.round(newValue));
  }
  
  return series;
}

/**
 * Seed product views
 */
async function seedProductViews(days: number, vendorId?: string) {
  console.log('Seeding product views...');
  
  // Get all products (optionally filtered by vendor)
  const products = await prisma.product.findMany({
    where: vendorId ? { vendorId } : {},
    select: { id: true, name: true, price: true }
  });
  
  // Get all users
  const users = await prisma.user.findMany({
    select: { id: true }
  });
  
  if (products.length === 0) {
    console.log('No products found to seed views for');
    return 0;
  }
  
  const devices = ['Mobile', 'Desktop', 'Tablet'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'];
  const sources = ['Google', 'Direct', 'Facebook', 'Twitter', 'Instagram', 'Email', 'Referral'];
  const countries = ['South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia', 'Zimbabwe', 'Tanzania', 'Uganda', 'Rwanda'];
  
  // Trend data - start with base views and add a growth trend
  const baseViews = randomInt(20, 50);
  const growthRate = randomInt(3, 10); // 3-10% daily growth
  const volatility = 0.4; // 40% volatility
  
  const viewTrend = generateTrendSeries(days, baseViews, growthRate, volatility);
  
  // Create sample ProductView records for each day
  const productViews = [];
  const endDate = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = subDays(endDate, days - i - 1);
    
    // Number of views for this day based on trend
    const viewsPerDay = viewTrend[i];
    
    for (let j = 0; j < viewsPerDay; j++) {
      const randomProduct = randomElement(products);
      const randomUser = users.length > 0 && Math.random() > 0.3 ? 
        randomElement(users) : null;
      
      // Random time during the day
      const viewTime = setSeconds(
        setMinutes(
          setHours(date, randomInt(7, 22)), // Between 7am and 10pm
          randomInt(0, 59)
        ),
        randomInt(0, 59)
      );
      
      productViews.push({
        productId: randomProduct.id,
        userId: randomUser?.id || null,
        viewedAt: viewTime,
        source: randomElement(sources),
        device: randomElement(devices),
        // browser, country, and referrer fields removed as they're not in the Prisma schema
      });
    }
  }
  
  // Insert all ProductView records
  if (productViews.length > 0) {
    try {
      console.log(`Attempting to create ${productViews.length} product views`);
      
      // Log the first record as a sample
      console.log('Sample product view:', JSON.stringify(productViews[0], null, 2));
      
      // Only include essential fields that are guaranteed to exist in the schema
      const validProductViews = productViews.map(view => {
        // Create a base record with only the required fields
        const baseRecord: any = {
          productId: view.productId,
          viewedAt: view.viewedAt,
        };
        
        // Only add optional fields if they should exist in schema
        if (view.userId) baseRecord.userId = view.userId;
        if (view.source) baseRecord.source = view.source;
        if (view.device) baseRecord.device = view.device;
        // country and referrer fields removed as they're not in the Prisma schema
        
        // Purposely omitting browser field since Prisma is rejecting it
        
        return baseRecord;
      });
      
      console.log('Sample processed view:', JSON.stringify(validProductViews[0], null, 2));
      
      await prisma.productView.createMany({
        data: validProductViews,
        skipDuplicates: true,
      });
      
      // Update product view counts
      for (const product of products) {
        const viewCount = productViews.filter(pv => pv.productId === product.id).length;
        await prisma.product.update({
          where: { id: product.id },
          data: { views: { increment: viewCount } }
        });
      }
    } catch (error) {
      console.error('Error creating product views:', error);
      throw new Error(`Failed to create product views: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return productViews.length;
}

/**
 * Seed orders data for analytics
 */
async function seedOrdersData(days: number, vendorId?: string) {
  console.log('Seeding orders data...');
  
  // Get products (optionally filtered by vendor)
  const products = await prisma.product.findMany({
    where: vendorId ? { vendorId } : {},
    select: { id: true, name: true, price: true, vendorId: true }
  });
  
  if (products.length === 0) {
    console.log('No products found to seed orders for');
    return 0;
  }
  
  // Get users
  const users = await prisma.user.findMany({
    select: { id: true, email: true }
  });
  
  if (users.length === 0) {
    console.log('No users found to seed orders for');
    return 0;
  }
  
  // Trend data - start with base orders and add a growth trend
  const baseOrders = randomInt(5, 15);
  const growthRate = randomInt(2, 8); // 2-8% daily growth
  const volatility = 0.5; // 50% volatility
  
  const orderTrend = generateTrendSeries(days, baseOrders, growthRate, volatility);
  
  // Create orders for each day
  const createdOrders = [];
  const endDate = new Date();
  
  const orderStatuses = [OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED];
  
  for (let i = 0; i < days; i++) {
    const date = subDays(endDate, days - i - 1);
    
    // Number of orders for this day based on trend
    const ordersPerDay = orderTrend[i];
    
    for (let j = 0; j < ordersPerDay; j++) {
      // Select a random user
      const randomUser = randomElement(users);
      
      // Create order
      const orderTime = randomDate(
        setHours(date, 8), // Start at 8am
        setHours(date, 22)  // End at 10pm
      );
      
      // Between 1 and 4 order items
      const itemCount = randomInt(1, 4);
      const orderItems = [];
      let orderTotal = 0;
      
      // Create order items
      for (let k = 0; k < itemCount; k++) {
        const randomProduct = randomElement(products);
        const quantity = randomInt(1, 3);
        const price = randomProduct.price;
        
        orderItems.push({
          productId: randomProduct.id,
          vendorId: randomProduct.vendorId,
          quantity,
          price,
        });
        
        orderTotal += price * quantity;
      }
      
      // Random status - weight toward COMPLETED for older orders
      const dayAge = days - i - 1;
      let statusChance = Math.min(0.8, dayAge / days);
      const isCompleted = Math.random() < statusChance;
      
      const status = isCompleted ? OrderStatus.DELIVERED : randomElement(orderStatuses);
      
      // Create the order
      try {
        const order = await prisma.order.create({
          data: {
            userId: randomUser.id,
            createdAt: orderTime,
            status,
            total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), // Calculate total from items
            orderItems: {
              create: orderItems.map(item => ({
                productId: item.productId,
                vendorId: item.vendorId, // Include vendorId in the order item creation
                quantity: item.quantity,
                price: item.price,
              }))
            }
          },
          include: {
            orderItems: true
          }
        });
        
        createdOrders.push(order);
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
  }
  
  return createdOrders.length;
}

/**
 * Generate user accounts for testing
 */
async function seedUsers(count: number) {
  console.log('Seeding user accounts...');
  
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Thabo', 'Sipho', 'Lerato', 'Nomsa', 'Blessing', 'Thabiso', 'Mandla'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Ndlovu', 'Dlamini', 'Nkosi', 'Mokoena', 'Khumalo', 'Mkhize', 'Zulu', 'Molefe'];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'example.com'];
  
  const endDate = new Date();
  const startDate = subDays(endDate, 90); // Users created over last 90 days
  
  const createdUsers = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const domain = randomElement(domains);
    const email = `${firstName.toLowerCase()}${randomInt(1, 999)}@${domain}`;
    
    try {
      // Create a user with randomized creation date
      const user = await prisma.user.create({
        data: {
          id: `kinde-${randomInt(100000, 999999)}`, // Simulating Kinde Auth ID format
          firstName,
          lastName,
          email,
          profileImage: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
          createdAt: randomDate(startDate, endDate)
        }
      });
      
      createdUsers.push(user);
    } catch (error) {
      // Skip duplicate emails
      console.log('Skipping duplicate email:', email);
    }
  }
  
  return createdUsers.length;
}

/**
 * Main function to seed all analytics data
 */
export async function seedAnalyticsData(options: SeedOptions = {}) {
  const {
    days = 30,
    vendorId,
    clearExisting = false,
    includeProducts = true,
    includeOrders = true,
    includeViews = true,
    includeUsers = true,
  } = options;
  
  console.log(`Starting analytics data seeding for ${days} days ${vendorId ? `for vendor ${vendorId}` : ''}`);
  
  // Optionally clear existing data
  if (clearExisting) {
    console.log('Clearing existing analytics data...');
    if (includeViews) {
      await prisma.productView.deleteMany({});
    }
    if (includeOrders) {
      await prisma.orderItem.deleteMany({});
      await prisma.order.deleteMany({});
    }
  }
  
  // Seed user data if needed
  let usersCreated = 0;
  if (includeUsers) {
    const userCount = await prisma.user.count();
    if (userCount < 10) {
      usersCreated = await seedUsers(25);
      console.log(`Created ${usersCreated} test users`);
    } else {
      console.log(`Using ${userCount} existing users`);
    }
  }
  
  // Seed products if needed (usually not needed as they should exist already)
  
  // Seed product views
  let viewsCreated = 0;
  if (includeViews) {
    viewsCreated = await seedProductViews(days, vendorId);
    console.log(`Created ${viewsCreated} product views`);
  }
  
  // Seed orders
  let ordersCreated = 0;
  if (includeOrders) {
    ordersCreated = await seedOrdersData(days, vendorId);
    console.log(`Created ${ordersCreated} orders with items`);
  }
  
  return {
    usersCreated,
    viewsCreated,
    ordersCreated,
  };
}
