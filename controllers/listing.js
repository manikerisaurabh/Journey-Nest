const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
    const allListing = await Listing.find()
    res.render("listings/index.ejs", { allListing });
    //res.send({ allListing }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    if (!list) {
        req.flash("error", "Listing you requested does not exits!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list })
};

module.exports.addNewListingToDb = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.editListingPage = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exits!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250/e_blur:150");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.editListing = async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof (req.file) !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings")
};

module.exports.filter = async (req, res) => {
    let { name } = req.params;
    let filterArr = [];
    let listing = await Listing.find({});
    listing.forEach(list => {
        let categories = list.category;
        categories.forEach(cat => {
            if (cat === name) {
                filterArr.push(list);

            }
        })
    });
    name = name.toUpperCase();
    res.render("listings/filter.ejs", { filterArr, name })

}