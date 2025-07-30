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
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { UploadButton } from "@/app/lib/uploadthing";
import { toast } from "sonner";

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
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/api/auth/login?post_login_redirect_url=/vendors/register');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-green-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
      const res = await fetch("/api/vendors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          storeImageUrl: form.logo, // Rename logo field to storeImageUrl for API compatibility
          establishedYear: form.establishedYear ? parseInt(form.establishedYear) : null,
          minimumOrder: form.minimumOrder ? parseInt(form.minimumOrder) : null,
          deliveryRadius: form.deliveryRadius ? parseInt(form.deliveryRadius) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-green-900">Application Submitted!</h2>
                <p className="text-green-600 leading-relaxed">
                  Thank you for applying to become a vendor on our agricultural marketplace. Your application is being reviewed by our team.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  <strong>What's next?</strong><br/>
                  You'll receive an email notification once your application is approved. This typically takes 1-2 business days.
                </p>
              </div>
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  className="w-full bg-green-600 hover:bg-green-700"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
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
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
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
              <CardContent className="p-8">
                <div className="mb-6">
                  <Label className="block mb-2 font-medium text-green-800 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Store Cover Image *
                  </Label>
                  <p className="text-sm text-green-600 mb-3">This will be displayed prominently on your store page</p>
                  
                  {isUploading ? (
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-green-200 bg-green-50 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="h-8 w-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-green-600">Uploading...</p>
                      </div>
                    </div>
                  ) : form.logo ? (
                    <div className="relative w-full h-48 rounded-lg border-2 border-green-200 overflow-hidden">
                      <img src={form.logo} alt="Store Cover" className="w-full h-full object-cover" />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Green Valley Farm"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select onValueChange={(value) => handleSelectChange('businessType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={form.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Business Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Farm Road, Green Valley, CA 12345"
                    value={form.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishedYear" className="flex items-center gap-2">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Your Business</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about your farm, products, and farming practices..."
                    value={form.bio}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
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
              <CardContent className="p-8">
                <div className="space-y-2">
                  <Label>Certifications</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {certificationOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cert-${option}`}
                          checked={form.certifications.includes(option)}
                          onCheckedChange={() => handleArrayToggle('certifications', option)}
                        />
                        <Label htmlFor={`cert-${option}`} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Specialties</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialtyOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`spec-${option}`}
                          checked={form.specialties.includes(option)}
                          onCheckedChange={() => handleArrayToggle('specialties', option)}
                        />
                        <Label htmlFor={`spec-${option}`} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
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
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimumOrder">Minimum Order Amount ($)</Label>
                    <Input
                      id="minimumOrder"
                      name="minimumOrder"
                      type="number"
                      placeholder="100"
                      value={form.minimumOrder}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryRadius">Delivery Radius (miles)</Label>
                    <Input
                      id="deliveryRadius"
                      name="deliveryRadius"
                      type="number"
                      placeholder="50"
                      value={form.deliveryRadius}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Review Your Information</h4>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><strong>Business:</strong> {form.name} ({form.businessType})</p>
                    <p><strong>Contact:</strong> {form.email}</p>
                    {form.certifications.length > 0 && (
                      <p><strong>Certifications:</strong> {form.certifications.join(', ')}</p>
                    )}
                    {form.specialties.length > 0 && (
                      <p><strong>Specialties:</strong> {form.specialties.join(', ')}</p>
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
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
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
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-green-600 text-white hover:bg-green-700" 
                disabled={loading}
              >
                {loading ? "Registering..." : "Complete Registration"}
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
          <p className="text-green-700">
            Already have an account?{" "}
            <Link href="/api/auth/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 