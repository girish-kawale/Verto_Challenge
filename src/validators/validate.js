// Middleware for validating requests using Joi schemas
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // Return all validation errors
      allowUnknown: false, // Don't allow unknown properties
      stripUnknown: false
    };

    // Validate different parts of the request
    const toValidate = {};
    if (schema.params) toValidate.params = req.params;
    if (schema.query) toValidate.query = req.query;
    if (schema.body) toValidate.body = req.body;

    const validationPromises = Object.keys(toValidate).map(key => {
      return schema[key].validateAsync(toValidate[key], validationOptions)
        .then(value => ({ key, value }))
        .catch(error => ({ key, error }));
    });

    Promise.all(validationPromises)
      .then(results => {
        const errors = results.filter(result => result.error);
        
        if (errors.length > 0) {
          const errorMessages = errors.reduce((acc, { key, error }) => {
            acc[key] = error.details.map(detail => detail.message);
            return acc;
          }, {});

          return res.status(400).json({
            error: 'Validation Error',
            details: errorMessages
          });
        }

        // Update req with validated values
        results.forEach(({ key, value }) => {
          if (value !== undefined) {
            req[key] = value;
          }
        });

        next();
      })
      .catch(next);
  };
};

module.exports = validate;