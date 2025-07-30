import Image from 'next/image';

interface VendorInfoProps {
  vendor: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    bio: string | null;
    website: string | null;
    logo: string | null;
    businessType: string | null;
    establishedYear: number | null;
    certifications: string[];
    specialties: string[];
    farmSize: string | null;
    farmingType: string | null;
    createdAt: Date;
  };
}

export default function VendorInfo({ vendor }: VendorInfoProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-8 border-b border-gray-100">
          <div className="flex items-center gap-6">
            {vendor.logo ? (
              <Image 
                src={vendor.logo} 
                alt={vendor.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-3xl">
                  {vendor.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{vendor.name}</h2>
              {vendor.businessType && (
                <p className="text-emerald-600 capitalize font-semibold text-lg">{vendor.businessType}</p>
              )}
              {vendor.establishedYear && (
                <p className="text-gray-500 text-sm mt-1">Since {vendor.establishedYear}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left Column - About & Specialties */}
            <div className="space-y-8">
              {vendor.bio && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    About Us
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">{vendor.bio}</p>
                </div>
              )}

              {vendor.specialties.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    Our Specialties
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {vendor.specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {vendor.certifications.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {vendor.certifications.map((cert, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details & Contact */}
            <div className="space-y-8">
              {/* Farm/Business Details */}
              {(vendor.farmSize || vendor.farmingType || vendor.address) && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    Business Details
                  </h3>
                  <div className="space-y-4">
                    {vendor.farmSize && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Farm Size</span>
                          <p className="font-semibold text-gray-900">{vendor.farmSize}</p>
                        </div>
                      </div>
                    )}

                    {vendor.farmingType && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Farming Type</span>
                          <p className="font-semibold text-gray-900 capitalize">{vendor.farmingType}</p>
                        </div>
                      </div>
                    )}

                    {vendor.address && (
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mt-0.5">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Location</span>
                          <p className="font-semibold text-gray-900">{vendor.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Get in Touch
                </h3>
                <div className="space-y-3">
                  {/* WhatsApp Button */}
                  {vendor.phone && (
                    <a 
                      href={`https://wa.me/${vendor.phone.replace(/\D/g, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        {/* WhatsApp Icon */}
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-600">Chat on WhatsApp</span>
                        <p className="font-semibold text-green-700">{vendor.phone}</p>
                      </div>
                    </a>
                  )}

                  {/* Website Button */}
                  {vendor.website && (
                    <a 
                      href={vendor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-blue-600">Visit Website</span>
                        <p className="font-semibold text-blue-700">View online store</p>
                      </div>
                    </a>
                  )}

                  {/* Email */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email Address</span>
                      <p className="font-semibold text-gray-900">{vendor.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
