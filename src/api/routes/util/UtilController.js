const stripe = require("stripe")("sk_test_9eW03yCMgQdeI1Oyx8RYwPJD");

class UtilController {
  async uploadedFileUrl(req, res) {
    console.log("req.files", req.files);
    if (req.files && req.files.documents && req.files.documents?.length > 1) {
      var type = "xl";
      const extensions = { IMAGE: "jpg", "DOCUMENT.PDF": "pdf" };
      const extension = extensions[type] || "";
      if (!extension) return res.warn("", req.__("INVALID_FILE_TYPE"));

      const uploader = require("../../../../lib/uploader");
      const promises = [];
      for (let i = 1; i <= count; i++) {
        promises.push(
          uploader.getSignedUrl(
            location.endsWith("/") ? location : `${location}/`,
            extension
          )
        );
      }
      const urls = await Promise.all(promises);
      res.success(urls);
    } else {
      res.success({});
    }
  }

  async uploadFile(req, res) {
    console.log(req.files);
    if (req.files) {
      const uploader = require("../../../../lib/uploader");
      const promises = [];
      promises.push(uploader.upload(req.files.documents, "userDocuments"));
      const urls = await Promise.all(promises);
      res.success(urls);
    } else {
      return res.warn("", req.__("No_Documents_Provided"));
    }
  }

  async createStripeIntent(req, res) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      // payment_method_types: ["card"],
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.json({ clientSecrete: paymentIntent });
  }
}

module.exports = new UtilController();
