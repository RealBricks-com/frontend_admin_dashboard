// API Types matching the OpenAPI schema

// Admin User Types
export interface AdminUserResponseDTO {
  id: number;
  email: string;
  firstName: string;
  role: string;
  createdAt: string;
}

export interface AdminUserCreateRequestDTO {
  email: string;
  passwordHash: string;
  firstName: string;
  role: string;
}

export interface AdminUserLoginRequestDTO {
  email: string;
  password: string;
}

// Developer Types
export interface DeveloperCoreResponseDTO {
  id: number;
  reraId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface DeveloperCoreCreateDTO {
  reraId: string;
  name: string;
  email: string;
  phone: string;
}

export interface DeveloperCoreUpdateDTO {
  name: string;
  email: string;
  phone: string;
}

// Project Types
export interface ProjectCoreDTO {
  id: number;
  reraId: string;
  name: string;
  slug: string;
  description: string;
  developerId: number;
  areaId: number;
  propertyType: string;
  carpetAreaSqft: number;
  minPrice: number;
  status: string;
  createdAt: string;
}

export interface ProjectCoreCreateDTO {
  reraId: string;
  name: string;
  slug: string;
  description: string;
  developerId: number;
  areaId: number;
  propertyType: string;
  carpetAreaSqft: number;
  minPrice: number;
  status: string;
}

// Lead Types
export interface LeadDTO {
  id: number;
  projectId: number;
  developerId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  budgetMin: number;
  budgetMax: number;
  leadStatus: string;
  leadScore: number;
  createdAt: string;
}

export interface LeadCreateDTO {
  projectId: number;
  developerId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  budgetMin: number;
  budgetMax: number;
  leadStatus: string;
  leadScore: number;
}

// Invoice Types
export interface InvoiceDTO {
  id: number;
  developerId: number;
  invoiceNumber: string;
  totalAmount: number;
  paymentStatus: string;
  dueDate: string;
  createdAt: string;
}

export interface InvoiceCreateDTO {
  developerId: number;
  invoiceNumber: string;
  totalAmount: number;
  paymentStatus: string;
  dueDate: string;
}

// Geographic Types
export interface CountryDTO {
  id: number;
  name: string;
  createdAt: string;
}

export interface StateDTO {
  id: number;
  name: string;
  countryId: number;
  createdAt: string;
}

export interface CityResponseDTO {
  id: number;
  name: string;
  stateId: number;
  stateName: string;
  createdAt: string;
}

export interface CityRequestDTO {
  stateId: number;
  name: string;
}

export interface DistrictDTO {
  id: number;
  name: string;
  cityId: number;
}

export interface Area {
  id: number;
  subDistrict: SubDistrict;
  name: string;
  pincode: string;
  createdAt: string;
}

export interface SubDistrict {
  id: number;
  district: District;
  name: string;
  createdAt: string;
}

export interface District {
  id: number;
  city: City;
  name: string;
  createdAt: string;
}

export interface City {
  id: number;
  state: State;
  name: string;
  createdAt: string;
}

export interface State {
  id: number;
  country: Country;
  name: string;
  createdAt: string;
}

export interface Country {
  id: number;
  name: string;
  createdAt: string;
}

// Amenity Types
export interface AmenityDTO {
  id: number;
  name: string;
  category: string;
  createdAt: string;
}

// Builder User Types
export interface BuilderUserResponseDTO {
  id: number;
  developerId: number;
  reraId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface BuilderUserRequestDTO {
  developerId: number;
  reraId: string;
  password: string;
  name: string;
  email: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}