export const createuservalidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at least 5 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display name cannot be empty",
    },
    isString: {
      errorMessage: "Display name must be a string!",
    },
  },
};
