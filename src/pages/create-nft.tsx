import React, { useContext, useEffect, useState } from "react";
import { Cardano, File, Mint } from "@/assets";
import { useForm, Controller } from "react-hook-form";
import { formResolver } from "@/validation/schema";
import { WalletContext } from "@/App";
import { toast } from "sonner";
import cardanoInstance from "@/services/cardano";
import { Loader2 } from "lucide-react";

export interface FormData {
  uploadedFile: File | null;
  itemName: string;
  externalLink: string;
  collection: string;
  supply: string;
  blockchain: string;
  description: string;
}

const CreateNFT: React.FC = () => {
  const wallet = useContext(WalletContext);
  const [formData, setFormData] = useState<FormData>({
    uploadedFile: null,
    itemName: "",
    externalLink: "",
    collection: "",
    supply: "",
    blockchain: "Cardano",
    description: "",
  });

  const [minting, setMinting] = useState<boolean>(false);

  // React Hook Form integration
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: formResolver,
    mode: "onTouched",
    defaultValues: formData,
  });

  useEffect(() => {
    const subscription = watch((value) =>
      setFormData((prev) => ({
        ...prev,
        ...(value as Partial<FormData>),
      }))
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    // Update both form state and react-hook-form
    setValue(name as keyof FormData, value as any);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Update both states and trigger validation
      setValue("uploadedFile", file);
      setFormData((prev) => ({
        ...prev,
        uploadedFile: file,
      }));
      await trigger("uploadedFile");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Update both states and trigger validation
      setValue("uploadedFile", file);
      setFormData((prev) => ({
        ...prev,
        uploadedFile: file,
      }));
      await trigger("uploadedFile");
    }
  };

  const onValid = async (validatedData: FormData) => {
    console.log("Handle Submit clicked with validated data:", validatedData);

    // Create FormData for submission
    const submitFormData = new FormData();
    if (validatedData.uploadedFile) {
      submitFormData.append("file", validatedData.uploadedFile);
    }

    // Append other form fields
    Object.entries(validatedData).forEach(([key, value]) => {
      if (key !== "uploadedFile" && value) {
        submitFormData.append(key, value.toString());
      }
    });

    setMinting(true);
    try {
      if (!wallet) {
        toast.error("Wallet not connected", {
          closeButton: true,
        });
        return;
      }
      const txHash = await cardanoInstance.mintNft(wallet, formData);
      toast.success(
        <div className="flex flex-col items-center">
          <p className="mb-2">NFT minted successfully!</p>
          <p className="text-sm text-gray-500">
            Tx Hash: <span className="font-mono">{txHash}</span>
          </p>
        </div>,
        {
          closeButton: true,
        }
      );
      clearForm();
    } catch (error) {
      console.error("Minting error:", error);
      toast.error("Minting failed. Please try again.", {
        closeButton: true,
      });
    } finally {
      setMinting(false);
    }
  };

  const onInvalid = (formErrors: any) => {
    console.log("Validation failed — errors:", formErrors);
    // Optionally show a toast here
  };

  // Helper function to get input classes with error states
  const getInputClasses = (fieldName: keyof FormData, baseClasses: string) => {
    const hasError = errors[fieldName];
    return `${baseClasses} ${
      hasError
        ? "border-red-500 focus:border-red-500"
        : "border-gray-600 focus:border-purple-500"
    }`;
  };

  const clearForm = () => {
    setFormData({
      uploadedFile: null,
      itemName: "",
      externalLink: "",
      collection: "",
      supply: "",
      blockchain: "Cardano",
      description: "",
    });
    // Reset react-hook-form values
    setValue("uploadedFile", null);
    setValue("itemName", "");
    setValue("externalLink", "");
    setValue("collection", "");
    setValue("supply", "");
    setValue("blockchain", "Cardano");
    setValue("description", "");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#140C1F] text-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Create Your Own Masterpiece
          </h1>
          <p className="text-xl text-gray-300">
            Get Onboard And Earn Money Like A Pro
          </p>
        </div>

        <form
          onSubmit={rhfHandleSubmit(onValid, onInvalid)}
          className="space-y-8"
        >
          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">NFT File *</label>
            <div
              className={`bg-gray-800/50 border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                errors.uploadedFile
                  ? "border-red-500 bg-red-500/10"
                  : dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-600"
              }`}
            >
              <Controller
                name="uploadedFile"
                control={control}
                render={({}) => (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="mb-4 bg-gray-700/20 p-4 rounded-lg w-24 h-24 mx-auto flex items-center justify-center">
                      <img
                        src={File}
                        alt="File"
                        className="w-16 h-16 mx-auto"
                      />
                    </div>
                    <h3 className="text-xl mb-2">
                      Drag And Drop Your NFT File Here
                    </h3>
                    <p className="text-gray-400 mb-6">
                      PNG, GIF, WEBP, JPEG. Max 10MB
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".png,.gif,.webp,.jpeg"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block bg-transparent border border-purple-500 text-purple-400 px-6 py-2 rounded-lg cursor-pointer hover:bg-purple-500 hover:text-white transition-colors"
                    >
                      Browse
                    </label>
                    {formData.uploadedFile && (
                      <p className="mt-4 text-green-400">
                        Selected: {formData.uploadedFile.name}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            {errors.uploadedFile && (
              <p className="text-red-500 text-sm">
                {errors.uploadedFile.message}
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Item Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Item Name *</label>
              <input
                type="text"
                {...register("itemName")}
                value={formData.itemName}
                onChange={handleInputChange}
                placeholder="Enter item name"
                className={getInputClasses(
                  "itemName",
                  "w-full bg-transparent rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors border border-gray-600 focus:border-purple-500"
                )}
              />
              {errors.itemName && (
                <p className="text-red-500 text-sm">
                  {errors.itemName.message}
                </p>
              )}
            </div>

            {/* External Link */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">External Link</label>
              <input
                type="url"
                {...register("externalLink")}
                value={formData.externalLink}
                onChange={handleInputChange}
                placeholder="https://yoursite.io/item/123"
                className={getInputClasses(
                  "externalLink",
                  "w-full bg-transparent rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors border border-gray-600 focus:border-purple-500"
                )}
              />
              {errors.externalLink && (
                <p className="text-red-500 text-sm">
                  {errors.externalLink.message}
                </p>
              )}
            </div>

            {/* Collection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Collection *</label>
              <select
                {...register("collection")}
                value={formData.collection}
                onChange={handleInputChange}
                className={getInputClasses(
                  "collection",
                  "w-full bg-[#140C1F] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors border border-gray-600 focus:border-purple-500"
                )}
              >
                <option value="">Select Collection</option>
                <option value="art">Art Collection</option>
                <option value="music">Music Collection</option>
                <option value="gaming">Gaming Collection</option>
              </select>
              {errors.collection && (
                <p className="text-red-500 text-sm">
                  {errors.collection.message}
                </p>
              )}
            </div>

            {/* Supply */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Supply *</label>
              <input
                type="number"
                {...register("supply")}
                value={formData.supply}
                onChange={handleInputChange}
                placeholder="1"
                min="1"
                className={getInputClasses(
                  "supply",
                  "w-full bg-transparent rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors border border-gray-600 focus:border-purple-500"
                )}
              />
              {errors.supply && (
                <p className="text-red-500 text-sm">{errors.supply.message}</p>
              )}
            </div>

            {/* Blockchain */}
            <div className="md:col-span-1 space-y-2">
              <label className="block text-sm font-medium">Blockchain</label>
              <div
                className={getInputClasses(
                  "blockchain",
                  "flex items-center space-x-4 rounded-lg px-4 py-3 text-white focus:outline-none transition-colors border border-gray-600 focus:border-purple-500"
                )}
              >
                <img src={Cardano} alt="cardano image" className="w-8 h-8" />
                <select
                  {...register("blockchain")}
                  value={formData.blockchain}
                  onChange={handleInputChange}
                  className="bg-transparent flex-1 text-white focus:outline-none"
                >
                  <option value="Cardano">Cardano</option>
                </select>
              </div>
              {errors.blockchain && (
                <p className="text-red-500 text-sm">
                  {errors.blockchain.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Description *</label>
            <textarea
              {...register("description")}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide a detailed description of your item"
              rows={6}
              className={getInputClasses(
                "description",
                "w-full bg-transparent rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors resize-none border border-gray-600 focus:border-purple-500"
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          {minting ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-center text-2xl mt-2 text-[#0d8409]">
                Minting...
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center text-white transition-colors duration-200 cursor-pointer w-fit mx-auto px-6 py-3 rounded-lg space-x-2 ${
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#0d8409] hover:bg-[#0fac09]"
              }`}
            >
              <img src={Mint} alt="Mint NFT" className="w-8 h-8" />
              <span className="text-2xl mx-auto">
                {isSubmitting ? "Minting..." : "Mint NFT"}
              </span>
            </button>
          )}

          {/* Form Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h3 className="text-red-400 font-medium mb-2">
                Please fix the following errors:
              </h3>
              <ul className="text-red-300 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    • {field}: {error?.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateNFT;
