import fValidator from "fastest-validator";

let v = new fValidator();

export const hexagonSchema = {
  name: {
    type: "string",
    optional: false,
    empty: false,
    trim: true,
    size: 20,
  },
  neighbor: {
    type: "string",
    optional: false,
    empty: false,
    trim: true,
    size: 20,
  },
  border: {
    type: "number",
    max: 5,
    min: 0,
    integer: true,
  },
  $$strict: true,
};

export const hexagonValidator = v.compile(hexagonSchema);
