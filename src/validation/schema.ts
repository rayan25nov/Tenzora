import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const formValidationSchema = yup.object().shape({
  uploadedFile: yup
    .mixed()
    .required("File is required")
    .test(
      "fileType",
      "Unsupported File Format",
      (value) =>
        value &&
        ((value instanceof File &&
          ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(
            value.type
          )) ||
          (Array.isArray(value) &&
            value.length > 0 &&
            value[0] instanceof File &&
            ["image/png", "image/jpeg", "image/gif", "image/webp"].includes(
              value[0].type
            )))
    ),
  //   required  name
  itemName: yup.string().required("Item name is required"),
  //   optional external link
  externalLink: yup.string().url("Invalid URL").optional(),
  collection: yup.string().required("Collection is required"),
  supply: yup
    .number()
    .integer("Supply must be an integer")
    .min(1, "Supply must be at least 1")
    .required("Supply is required"),
  blockchain: yup.string().required("Blockchain is required"),
  description: yup.string().required("Description is required"),
});

export const formResolver = yupResolver(formValidationSchema) as any;
