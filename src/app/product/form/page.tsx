// Create new form to add product

"use client";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { ProductFormController } from "./ProductFormController";

interface ProductFormProps {
  isEditMode?: boolean;
  productId?: any;
}

const ProductForm: React.FC<ProductFormProps> = ({ isEditMode = false, productId }) => {
  const {
    handleChange,
    handleTagChange,
    addTag,
    handleReviewChange,
    addReview,
    handleImageChange,
    handleThumbnailChange,
    handleQRCodeChange,
    handleSubmit,
    formData } = ProductFormController(isEditMode, productId)

  return (
    <div className="h-full min-h-screen overflow-y-scroll">
      <Navbar />
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <label className="mb-1 ml-1 block">Title</label>
            <Input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Title</label>
            <Input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Category</label>

            <Input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Price</label>

            <Input
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Discount %</label>

            <Input
              name="discountPercentage"
              placeholder="Discount %"
              value={formData.discountPercentage}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Rating</label>

            <Input
              name="rating"
              placeholder="Rating"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Stock</label>

            <Input
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Brand</label>

            <Input
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>
          <div></div>
        </div>

        <div className="grid grid-cols-1">
          <label className="mb-1 ml-1 block">Tag</label>
          {formData.tags.map((tag, index) => (
            <Input
              key={index}
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              placeholder={`Tag ${index + 1}`}
              className="mb-4"
            />
          ))}
          <button
            type="button"
            onClick={addTag}
            className="mb-4 justify-self-end"
          >
            Add More
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <label className="mb-1 ml-1 block">SKU</label>

            <Input
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Weight</label>

            <Input
              name="weight"
              placeholder="Weight"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Width</label>

            <Input
              name="dimensions.width"
              placeholder="Width"
              value={formData.dimensions.width}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Height</label>

            <Input
              name="dimensions.height"
              placeholder="Height"
              value={formData.dimensions.height}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Depth</label>

            <Input
              name="dimensions.depth"
              placeholder="Depth"
              value={formData.dimensions.depth}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Warranty Info</label>

            <Input
              name="warrantyInformation"
              placeholder="Warranty Info"
              value={formData.warrantyInformation}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Shipping Info</label>

            <Input
              name="shippingInformation"
              placeholder="Shipping Info"
              value={formData.shippingInformation}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Availability</label>

            <Input
              name="availabilityStatus"
              placeholder="Availability"
              value={formData.availabilityStatus}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 ml-1 block">Rating</label>
          {formData.reviews.map((review, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              <div>
                <Input
                  placeholder={`Rating ${index + 1}`}
                  value={review.rating}
                  onChange={(e) =>
                    handleReviewChange(index, "rating", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder={`Comment ${index + 1}`}
                  value={review.comment}
                  onChange={(e) =>
                    handleReviewChange(index, "comment", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder={`Reviewer Name ${index + 1}`}
                  value={review.reviewerName}
                  onChange={(e) =>
                    handleReviewChange(index, "reviewerName", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  placeholder={`Reviewer Email ${index + 1}`}
                  value={review.reviewerEmail}
                  onChange={(e) =>
                    handleReviewChange(index, "reviewerEmail", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <div className="mb-4 flex justify-end">
            <button type="button" onClick={addReview}>
              Add More
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <label className="mb-1 ml-1 block">Return Policy</label>
            <Input
              name="returnPolicy"
              placeholder="Return Policy"
              value={formData.returnPolicy}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-1 ml-1 block">Minimum Order Quantity</label>
            <Input
              name="minimumOrderQuantity"
              placeholder="Minimum Order Quantity"
              value={formData.minimumOrderQuantity}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Barcode</label>

            <Input
              name="meta.barcode"
              placeholder="Barcode"
              value={formData.meta.barcode}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 ml-1 block">Upload QR Code</label>
            <Input type="file" onChange={handleQRCodeChange} />
            <div className="mt-2">
              {isEditMode && formData.meta?.qrCode}
            </div>
          </div>
          <div>
            <label className="mb-1 ml-1 block">Upload Images</label>
            {formData.images.map((_, index) => (
              <Input
                key={index}
                type="file"
                onChange={(e) => handleImageChange(e, index)}
              />
            ))}
            <div className="mt-2">
              {isEditMode && formData.images}
            </div>
          </div>
          <div>
            <label className="mb-1 ml-1 block">Upload Thumbnail</label>
            <Input type="file" onChange={handleThumbnailChange} />
            <div className="mt-2">
              {isEditMode && formData.thumbnail}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="rounded bg-green-500 px-10 py-2 text-center text-white"
          >
            {isEditMode ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
