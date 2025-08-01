"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Leaf, 
  Truck, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Store,
  ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/app/hooks/useAuthState";
import { UploadButton } from "@/app/lib/uploadthing";
import { toast } from "sonner";
import Image from 'next/image';

const businessTypes = [
  "Farm",
  "Distributor",
  "Processor",
  "Cooperative",
  "Retailer",
  "Wholesaler",
];

const certificationOptions = [
  "Organic",
  "Fair Trade",
  "Non-GMO",
  "Rainforest Alliance",
  "USDA Certified",
  "Global GAP",
];

const specialtyOptions = [
  "Fruits",
  "Vegetables",
  "Grains",
  "Herbs",
  "Dairy",
  "Meat",
  "Poultry",
  "Seeds",
  "Equipment",
  "Fertilizer",
];

export default function VendorRegisterPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthState();
  const isAuthenticated = !!user;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    businessType: "",
    establishedYear: "",
    certifications: [] as string[],
    specialties: [] as string[],
    minimumOrder: "",
    deliveryRadius: "",
    logo: "", // Store logo URL
  });
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Show loading while checking authentication - give more time
  if (isLoading) {
    return (
      <div className="light min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-green-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Only show auth required if we've checked and definitely not authenticated
  if (!isAuthenticated && !user) {
    return (
      <div className="light min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">Authentication Required</h2>
          <p className="text-gray-600">You need to be signed in to register as a vendor.</p>
          <div className="space-y-2">
            <Link href="/api/auth/login?post_login_redirect_url=/vendors/register">
              <Button className="bg-green-600 hover:bg-green-700 w-full">
                Sign In to Continue
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleArrayToggle = (name: 'certifications' | 'specialties', value: string) => {
    const currentArray = form[name];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    setForm({ ...form, [name]: newArray });
  };

  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (stepNumber === 1) {
      if (!form.name.trim()) errors.name = "Business name is required";
      if (!form.email.trim()) errors.email = "Email is required";
      if (!form.businessType) errors.businessType = "Business type is required";
      if (!form.logo) errors.logo = "Store cover image is required";
    }
    
    if (stepNumber === 2 && form.specialties.length === 0) {
      errors.specialties = "Please select at least one specialty";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (validateStep(step)) {
      setStep(step + 1);
      setError("");
    }
  };

  const prevStep = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setStep(step - 1);
    setError("");
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3 || !validateStep(3)) return; // Only allow submission on step 3
    
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      console.log('Submitting vendor registration with data:', {
        ...form,
        logo: form.logo, // Keep the logo field name as expected by API
        establishedYear: form.establishedYear ? parseInt(form.establishedYear) : null,
        minimumOrder: form.minimumOrder ? parseInt(form.minimumOrder) : null,
        deliveryRadius: form.deliveryRadius ? parseInt(form.deliveryRadius) : null,
      });

      const res = await fetch("/api/vendors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          logo: form.logo, // Use logo field name as expected by API
          establishedYear: form.establishedYear ? parseInt(form.establishedYear) : null,
          minimumOrder: form.minimumOrder ? parseInt(form.minimumOrder) : null,
          deliveryRadius: form.deliveryRadius ? parseInt(form.deliveryRadius) : null,
        }),
      });
      
      const data = await res.json();
      console.log('Vendor registration response:', { status: res.status, data });
      
      if (!res.ok) {
        console.error('Vendor registration failed:', data);
        throw new Error(data.error || "Registration failed");
      }
      
      console.log('Vendor registration successful!', data);
      setSuccess(true);
      
      // Redirect to vendor dashboard after successful registration
      setTimeout(() => {
        router.push("/vendor/dashboard");
      }, 3000);
    } catch (err: any) {
      console.error('Error during vendor registration:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="light min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white border-gray-200 shadow-xl">
          <CardContent className="pt-6 bg-white">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
                <p className="text-gray-700 leading-relaxed">
                  Thank you for applying to become a vendor on our agricultural marketplace. Your application is being reviewed by our team.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>What&apos;s next?</strong><br/>
                  You&apos;ll receive an email notification once your application is approved. This typically takes 1-2 business days.
                </p>
              </div>
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={() => router.push('/vendor/dashboard')} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Go to Dashboard
                </Button>
                <Link href="/" className="block text-green-600 hover:text-green-700 underline text-sm">
                  Return to Homepage
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalSteps = 3;
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="light min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-3">Join Our Marketplace</h1>
          <p className="text-green-700 max-w-2xl mx-auto text-lg leading-relaxed">
            Connect with buyers across the region and grow your agricultural business. 
            Join thousands of vendors already selling on our platform.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Step {step} of {totalSteps}</span>
            <span className="text-sm text-green-600">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  i === step
                    ? "bg-white border-white text-green-600"
                    : i < step
                    ? "bg-green-200 border-green-200 text-green-700"
                    : "bg-transparent border-green-200"
                }`}
              >
                {i < step && <CheckCircle className="h-3 w-3" />}
                {i === step && <span className="text-xs font-bold">{i}</span>}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                      <Building className="h-6 w-6" />
                      Business Information
                    </CardTitle>
                    <CardDescription className="text-green-100 text-base">
                      Tell us about your agricultural business
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          i === step
                            ? "bg-white border-white text-green-600"
                            : i < step
                            ? "bg-green-200 border-green-200 text-green-700"
                            : "bg-transparent border-green-200"
                        }`}
                      >
                        {i < step && <CheckCircle className="h-3 w-3" />}
                        {i === step && <span className="text-xs font-bold">{i}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="mb-6">
                  <Label className="mb-2 font-medium text-gray-800 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Store Cover Image *
                  </Label>
                  <p className="text-sm text-gray-600 mb-3">This will be displayed prominently on your store page</p>
                  
                  {isUploading ? (
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-green-200 bg-green-50 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="h-8 w-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-green-600">Uploading...</p>
                      </div>
                    </div>
                  ) : form.logo ? (
                    <div className="relative w-full h-48 rounded-lg border-2 border-green-200 overflow-hidden">
                      <Image src={form.logo} alt="Store Cover" layout="fill" className="object-cover" />
                      <div className="absolute top-2 right-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="bg-white/80 backdrop-blur-sm hover:bg-white"
                          onClick={() => {
                            setForm({...form, logo: ""});
                          }}
                        >
                          Change Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-green-200 bg-green-50 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="mx-auto h-10 w-10 mb-3 flex items-center justify-center rounded-full bg-green-100">
                          <ImageIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="mb-2 text-sm font-medium text-green-700">Upload store cover image</p>
                        <p className="mb-4 text-xs text-green-500">Recommended size: 1200 × 300 pixels</p>
                        <UploadButton
                          // @ts-ignore - storeCover endpoint is defined in the uploadthing router
                          endpoint="storeCover"
                          onClientUploadComplete={async (res) => {
                            if (res && res[0]) {
                              setForm({...form, logo: res[0].url});
                              toast.success("Cover image uploaded successfully");
                            }
                            setIsUploading(false);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`Error: ${error.message}`);
                            setIsUploading(false);
                          }}
                          onUploadBegin={() => {
                            setIsUploading(true);
                          }}
                          appearance={{
                            button: {
                              background: "#16a34a",
                              color: "white",
                              padding: "0.5rem 1rem",
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {fieldErrors.logo && <p className="text-red-600 text-sm mt-2">{fieldErrors.logo}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-800 font-medium">Business Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Green Valley Farm"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      className={`bg-white border-gray-300 text-gray-900 placeholder-gray-500 ${fieldErrors.name ? 'border-red-500' : ''}`}
                    />
                    {fieldErrors.name && <p className="text-red-600 text-sm">{fieldErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-gray-800 font-medium">Business Type *</Label>
                    <Select onValueChange={(value) => handleSelectChange('businessType', value)}>
                      <SelectTrigger className={`bg-white border-gray-300 text-gray-900 ${fieldErrors.businessType ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-gray-900 hover:bg-gray-100">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.businessType && <p className="text-red-600 text-sm">{fieldErrors.businessType}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-gray-800 font-medium">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="contact@greenvalley.com"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      className={`bg-white border-gray-300 text-gray-900 placeholder-gray-500 ${fieldErrors.email ? 'border-red-500' : ''}`}
                    />
                    {fieldErrors.email && <p className="text-red-600 text-sm">{fieldErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-gray-800 font-medium">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={form.phone}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-gray-800 font-medium">
                    <MapPin className="h-4 w-4" />
                    Business Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Farm Road, Green Valley, CA 12345"
                    value={form.address}
                    onChange={handleInputChange}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishedYear" className="flex items-center gap-2 text-gray-800 font-medium">
                    <Calendar className="h-4 w-4" />
                    Established Year
                  </Label>
                  <Input
                    id="establishedYear"
                    name="establishedYear"
                    type="number"
                    placeholder="2010"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={form.establishedYear}
                    onChange={handleInputChange}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-800 font-medium">About Your Business</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about your farm, products, and farming practices..."
                    value={form.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                      <Leaf className="h-6 w-6" />
                      Products & Certifications
                    </CardTitle>
                    <CardDescription className="text-green-100 text-base">
                      What products do you specialize in?
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          i === step
                            ? "bg-white border-white text-green-600"
                            : i < step
                            ? "bg-green-200 border-green-200 text-green-700"
                            : "bg-transparent border-green-200"
                        }`}
                      >
                        {i < step && <CheckCircle className="h-3 w-3" />}
                        {i === step && <span className="text-xs font-bold">{i}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="space-y-2">
                  <Label className="text-gray-800 font-medium">Certifications</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {certificationOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cert-${option}`}
                          checked={form.certifications.includes(option)}
                          onCheckedChange={() => handleArrayToggle('certifications', option)}
                          className="border-gray-300"
                        />
                        <Label htmlFor={`cert-${option}`} className="text-sm text-gray-800">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-800 font-medium">Specialties</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialtyOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`spec-${option}`}
                          checked={form.specialties.includes(option)}
                          onCheckedChange={() => handleArrayToggle('specialties', option)}
                          className="border-gray-300"
                        />
                        <Label htmlFor={`spec-${option}`} className="text-sm text-gray-800">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {fieldErrors.specialties && <p className="text-red-600 text-sm">{fieldErrors.specialties}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                      <Award className="h-6 w-6" />
                      Final Details
                    </CardTitle>
                    <CardDescription className="text-green-100 text-base">
                      Complete your vendor profile
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          i === step
                            ? "bg-white border-white text-green-600"
                            : i < step
                            ? "bg-green-200 border-green-200 text-green-700"
                            : "bg-transparent border-green-200"
                        }`}
                      >
                        {i < step && <CheckCircle className="h-3 w-3" />}
                        {i === step && <span className="text-xs font-bold">{i}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimumOrder" className="text-gray-800 font-medium">Minimum Order Amount ($)</Label>
                    <Input
                      id="minimumOrder"
                      name="minimumOrder"
                      type="number"
                      placeholder="100"
                      value={form.minimumOrder}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryRadius" className="text-gray-800 font-medium">Delivery Radius (miles)</Label>
                    <Input
                      id="deliveryRadius"
                      name="deliveryRadius"
                      type="number"
                      placeholder="50"
                      value={form.deliveryRadius}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Review Your Information</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong className="text-gray-800">Business:</strong> {form.name} ({form.businessType})</p>
                    <p><strong className="text-gray-800">Contact:</strong> {form.email}</p>
                    {form.certifications.length > 0 && (
                      <p><strong className="text-gray-800">Certifications:</strong> {form.certifications.join(', ')}</p>
                    )}
                    {form.specialties.length > 0 && (
                      <p><strong className="text-gray-800">Specialties:</strong> {form.specialties.join(', ')}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <Button 
                type="button" 
                onClick={prevStep} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <Button 
                type="button" 
                onClick={nextStep} 
                className="bg-green-600 text-white hover:bg-green-700"
                disabled={step === 1 && (!form.name || !form.email || !form.businessType || !form.logo)}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-green-600 text-white hover:bg-green-700" 
                disabled={loading}
              >
                {loading ? "Registering..." : "Complete Registration"}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </form>

        {/* Already have an account */}
        <div className="text-center mt-8">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link href="/api/auth/login" className="text-green-600 hover:text-green-700 font-medium underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}