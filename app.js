var bodyParser       = require("body-parser"),
	mongoose       	 = require("mongoose"),
	methodOverride   = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	express 		 = require("express"),
	app		         = express();

//app config

mongoose.connect("mongodb://localhost/CODE_blog");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//server requirements

const http 	   = require("http");
const hostname = "127.0.0.1";
const port     = 3000;

//mongoSchema

var blogSchema = new mongoose.Schema({
	title : String,
	body : String,
	image : String,
	created : {type : Date , default : Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//index route

app.get("/blogs", function(req, res){
	Blog.find({},function(err, blogs){
		if (err) {
			console.log(err);
		}	else {
			res.render("index", {blogs:blogs});

		}
	});

});

app.get("/", function(req, res){
	res.redirect("/blogs");
});

//new route

app.get("/blogs/new", function(req, res){
	res.render("new");
});

//create route

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	var formData = req.body.blog;
	Blog.create(formData, function(err, newBlog){
		if (err) {
			res.redirect("/blogs/new");
		}	else{
			res.redirect("/")
		}
	});
});

//show route

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
})

//edit route


app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//update route

app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//delete route

app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

// server 

app.listen(port, hostname, function(){
	console.log("Server has Started");
});