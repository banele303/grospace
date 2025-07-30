# Articles System Documentation

This project includes a comprehensive articles/blog management system with admin-only access controls.

## Features

### 🔒 Admin-Only Access
- Only users with `ADMIN` role can create, edit, and delete articles
- All article management routes are protected
- Non-admin users can only view published articles

### 📝 Article Management
- **Create Articles**: Rich text editor for creating blog posts
- **Edit Articles**: Update existing articles with full version control
- **Draft System**: Save articles as drafts before publishing
- **Featured Images**: Add hero images to articles
- **Tags System**: Categorize articles with multiple tags
- **SEO-Friendly URLs**: Automatic slug generation from titles

### 🎨 Public Display
- **Articles Listing**: Clean grid layout showing all published articles
- **Individual Article View**: Full article display with author info
- **Responsive Design**: Mobile-friendly layout
- **Navigation Integration**: Articles link in main navigation

## API Routes

### Public Routes
- `GET /api/articles` - List all published articles
- `GET /api/articles/[id]` - Get single article by ID or slug

### Admin-Only Routes
- `POST /api/articles` - Create new article
- `PUT /api/articles/[id]` - Update existing article
- `DELETE /api/articles/[id]` - Delete article

## Database Schema

```sql
model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  excerpt     String?  @db.Text
  featuredImage String?
  published   Boolean  @default(false)
  publishedAt DateTime?
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  tags        String[] @default([])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Usage

### Setting Up Admin Access

1. **Create Admin User**: First, make sure you have a user account
2. **Set Admin Role**: Update a user's role to ADMIN in the database:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

### Creating Articles

1. **Access Admin Panel**: Navigate to `/admin/articles`
2. **Create New Article**: Click "Create Article" button
3. **Fill Article Details**:
   - Title (required)
   - Content (required)
   - Excerpt (optional)
   - Featured Image URL (optional)
   - Tags (optional)
   - Published status
4. **Save**: Click "Create Article" or "Save as Draft"

### Managing Articles

- **View All Articles**: `/admin/articles`
- **Edit Article**: Click edit button in articles table
- **Delete Article**: Click delete button (with confirmation)
- **Preview Article**: View article as it appears to public

### Public Access

- **Articles Page**: `/articles` - Shows all published articles
- **Individual Article**: `/articles/[slug]` - View specific article
- **Navigation**: Articles link appears in main navigation

## File Structure

```
app/
├── api/
│   └── articles/
│       ├── route.ts              # List & create articles
│       └── [id]/
│           └── route.ts          # Get, update & delete article
├── admin/
│   └── articles/
│       ├── page.tsx              # Articles management page
│       ├── create/
│       │   └── page.tsx          # Create article page
│       └── [id]/
│           └── edit/
│               └── page.tsx      # Edit article page
├── articles/
│   ├── page.tsx                  # Public articles listing
│   └── [slug]/
│       └── page.tsx              # Individual article view
└── components/
    └── admin/
        ├── ArticlesTable.tsx     # Articles management table
        └── ArticleForm.tsx       # Article creation/editing form
```

## Testing

Run the articles system test to verify everything is working:

```bash
npm run test-articles
```

This will:
- Check database connectivity
- Verify Article model is working
- Look for admin users
- Create a test article (if admin users exist)
- Test article retrieval

## Security Features

- **Role-Based Access**: Only admins can manage articles
- **Input Validation**: Server-side validation for all inputs
- **Unique Slugs**: Automatic slug generation with uniqueness checks
- **Protected Routes**: API routes check user permissions
- **Safe Deletion**: Confirmation dialogs for destructive actions

## Customization

### Styling
- Articles use Tailwind CSS classes
- Responsive design for mobile/desktop
- Dark mode support included

### Content
- Rich text content support (can be extended with WYSIWYG editor)
- Image upload integration ready (currently URL-based)
- Tag system for categorization

### SEO
- Automatic slug generation
- Meta description support via excerpt
- Structured URL patterns

## Troubleshooting

### Common Issues

1. **"Admin access required" error**
   - Ensure user role is set to 'ADMIN' in database
   - Check authentication status

2. **Articles not appearing**
   - Verify articles are marked as published
   - Check database connection

3. **Slug conflicts**
   - Article titles must be unique
   - System automatically generates unique slugs

### Development Tips

- Use browser dev tools to check API responses
- Check server logs for detailed error messages
- Verify database migrations are up to date

## Future Enhancements

- Rich text WYSIWYG editor integration
- Image upload and management
- Article categories and advanced filtering
- Comment system
- Article analytics and views tracking
- RSS feed generation
- Social media sharing
