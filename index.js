import express from "express";
import multer from "multer";
import sizeOf from "image-size";
import sharp from "sharp";
import fs from "fs";
import axios from "axios";
import crypto from "crypto";

const app = express();

const img = multer({
  dest: "./img",
});

app
  .use(express.urlencoded({ extended: true }))
  .set("view engine", "ejs")
  .set("views", "views")
  .get("/", (r) => r.res.render("./index"))
  .post("/size2json", img.single("image"), async (r) => {
    const tempPath = r.file.path;
    sizeOf(tempPath, function (err, dimensions) {
      r.res.send({
        width: dimensions.width,
        height: dimensions.height,
      });
    });
  })
  .get("/makeimage?", (r) => {
    const width = parseInt(r.query.width);
    const height = parseInt(r.query.height);
    sharp("./img/photo-recommendation.png")
      .resize(width, height)
      .toFile("./img/photo-recommendation.png", (err, info) => {
        r.res.download("./img/output.png");
      });
  })
  .get("/wordpress/", async (req, res, next) => {
    const content = req.query.content;
    const response = await axios.post(
      "https://wordpress.kodaktor.ru/wp-json/jwt-auth/v1/token",
      { username: "gossjsstudent2017", password: "|||123|||456" }
    );
    const token = response.data.token;
    const WPresponse = await axios.post(
      `https://wordpress.kodaktor.ru/wp-json/wp/v2/posts/`,

      { content, title: "309518", status: "publish" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.send(WPresponse.data.id + "");
  })
  .all("/log", (r) => {
    console.log(r.params.data);
    console.log(r.headers);
  })
  .get("/sha1", (r) => {
    r.res.render("./sha", { value: "" });
  })
  
  .all("/login", (r) => r.res.send("309518"))
  .listen(process.env.PORT || 3000, () => {
    console.log("Server is working");
  });