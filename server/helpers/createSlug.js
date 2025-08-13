module.exports.CreateSlugString = (str, Service) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = str;
      const slugcount = await Service.checkSlug(result);
      if (!slugcount) {
        return resolve(result);
      } else {
        let temp = `${str}-1`;
        let suffix = 1;

        while (true) {
          const slugCount = await Service.checkSlug(temp);

          if (slugCount === 0) {
            // Slug is unique, resolve with the result
            return resolve(temp);
          } else {
            // Slug already exists, modify and retry
            suffix++;
            temp = `${str}-${suffix}`;
          }
        }
      }
    } catch (error) {
      console.log("error CreateSlugString : ", error);
      reject(false);
    }
  });
};
