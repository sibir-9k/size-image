import express from "express";
import multer from "multer";
import sharp from "sharp";

import axios from "axios";
import crypto from "crypto";
import sizeOf from "image-size";

const app = express();
const img = multer({
	dest: "./img",
});

app.use(express.urlencoded({extended: true}))
	.set("view engine", "ejs")
	.set("views", "views")
	.get("/", (r) => {
		r.res.render("./index");
	})
	.post("/size2json/", img.single("image"), async (r) => {
		const temp = r.file.path;
		sizeOf(temp, function (error, dimensions) {
			r.res.send({width: dimensions.width, height: dimensions.height});
		});
	})
	.get("/makeimage?", (r) => {
		const width = parseInt(r.query.width);
		const height = parseInt(r.query.height);
		sharp("./img/photo-recommendation.png")
			.resize(width, height)
			.toFile("./img/output.png", (error, info) => {
				r.res.download("./img/output.png");
			});
	})
	.get("/wordpress/", async (req, res, next) => {
		const content = req.query.content;
		const response = await axios.post("https://wordpress.kodaktor.ru/wp-json/jwt-auth/v1/token", {username: "gossjsstudent2017", password: "|||123|||456"});
		const token = response.data.token;
		const WPresponse = await axios.post(
			`https://wordpress.kodaktor.ru/wp-json/wp/v2/posts/`,

			{content, title: "309518", status: "publish"},
			{
				headers: {Authorization: `Bearer ${token}`},
			}
		);
		res.send(WPresponse.data.id + "");
	})
	.all("/login", (r) => {
		r.res.send("309518");
	})

	.listen(3000, () => {
		console.log("Hello world");
	});
