// Create a type file to define type

export interface Review {
  rating: string;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export interface Dimensions {
  width: string;
  height: string;
  depth: string;
};

export interface Meta {
  createdAt: any;
  barcode: string;
  qrCode: string;
};

export interface ProductFormData {
  id: any;
  title: string;
  description: string;
  category: string;
  price: string;
  discountPercentage: string;
  rating: string;
  stock: string;
  tags: string[];
  brand: string;
  sku: string;
  weight: string;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: string;
  meta: Meta;
  images: string[];
  thumbnail: string;
};
