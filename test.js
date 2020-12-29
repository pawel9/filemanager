//zmienne, stałe

var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var hbs = require('express-handlebars');
var path = require("path");
var context = {
    files:[]
};
var formidable = require('formidable');
var id = 1;


//funkcje na serwerze obsługujace konkretne adresy w przeglądarce

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ 
    defaultLayout: 'main.hbs',
    extname: '.hbs', 
    partialsDir: "views/partials",
    helpers: {         
        makeImage: function (image) {
                if(image == "pdf"){
                    var tempImage = 'pdf.png';
                    return tempImage;
                }else if(image == "doc"){
                    var tempImage = 'doc.png';
                    return tempImage;
                }else if(image == "txt"){
                    var tempImage = 'txt.png';
                    return tempImage;
                }else if(image == "jpg"){
                    var tempImage = 'jpg.png'
                    return tempImage;
                }else if(image == "png"){
                    var tempImage = 'png.png';
                    return tempImage;
                }else{
                    var tempImage = 'unknown.png';
                    return tempImage;
                } 
        }, }})); 
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów

app.get("/", function (req, res) { 
    res.render('filemanager.hbs', context); 
})
app.get("/upload", function (req, res) { 
    res.render('upload.hbs', context); 
})
app.get("/filemanager", function (req, res) { 
    res.render('filemanager.hbs', context); 
})
app.get("/info", function (req, res) { 
    res.render('info.hbs'); 
})
app.get("/deleteAll", function (req, res) { 
    context = {
        files:[]
    };
    id = 1;
    res.render('filemanager.hbs', context); 
})
app.get("/delete/:id", function (req, res) {
    var tempId = parseInt(req.params.id);
    for(let i = 0;i<context.files.length; i++){
        if(tempId == context.files[i].id){
            context.files.splice(i, 1);
        }
    } 
    res.redirect("/filemanager");
}) 

app.get("/info/:id", function (req, res) {
    var tempId = parseInt(req.params.id);
    var context2;
    for(let i = 0;i<context.files.length; i++){
        if(tempId == context.files[i].id){
            context2 = {
                id: context.files[i].id,
                name: context.files[i].name,
                path: context.files[i].path,
                size: context.files[i].size,
                type: context.files[i].type,
                savedate: context.files[i].savedate
            };
        }
    }


    res.render('info.hbs', context2); 
})

app.get("/download/:id", function (req, res) {
    var tempId = parseInt(req.params.id);
    var file;
    for(let i = 0;i<context.files.length; i++){
        if(tempId == context.files[i].id){
            file = context.files[i].path;
        }
    }
    res.download(file);
})



app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia
    form.keepExtensions = true                           // zapis z rozszerzeniem pliku
    form.multiples = true                                // zapis wielu plików  

    form.parse(req, function (err, fields, files) { 

        if(files.imagetoupload.length == undefined){
            var tempName = files.imagetoupload.name;
            var tempType = files.imagetoupload.type;
            var tempSize = files.imagetoupload.size;
            var tempPath = files.imagetoupload[i].path; 
            var tempDate = new Date().getTime();

            if(files.imagetoupload.type == "application/msword"){
                var tempImage = 'doc';
            }else if(files.imagetoupload.type == "text/plain"){
                var tempImage = 'txt';
            }else if(files.imagetoupload.type == "image/png"){
                var tempImage = 'png';
            }else if(files.imagetoupload.type == "image/jpeg"){
                var tempImage = 'jpg';
            }else if(files.imagetoupload.type == "application/pdf"){
                var tempImage = 'pdf';
            }else{
                var tempImage = 'unknown';
            }

            context.files.push({id:id, image:tempImage, name: tempName, size: tempSize, type: tempType, path:tempPath, savedate:tempDate});          
            id++;
            res.redirect("/filemanager");
        }else{
            for(let i = 0;i<files.imagetoupload.length;i++){
                var tempName = files.imagetoupload[i].name;
                var tempType = files.imagetoupload[i].type;
                var tempSize = files.imagetoupload[i].size;
                var tempPath = files.imagetoupload[i].path; 
                var tempDate = new Date().getTime();
                
                if(files.imagetoupload[i].type == "application/msword"){
                    var tempImage = 'doc';
                }else if(files.imagetoupload[i].type == "text/plain"){
                    var tempImage = 'txt';
                }else if(files.imagetoupload[i].type == "image/png"){
                    var tempImage = 'png';
                }else if(files.imagetoupload[i].type == "image/jpeg"){
                    var tempImage = 'jpg';
                }else if(files.imagetoupload[i].type == "application/pdf"){
                    var tempImage = 'pdf';
                }else{
                    var tempImage = 'unknown';
                }

                context.files.push({id: id, image:tempImage, name: tempName, size: tempSize, type: tempType, path:tempPath, savedate:tempDate});
                id++;
            }
            res.redirect("/filemanager");

        }      
    });
});

app.use(express.static('static'))

//nasłuch na określonym porcie

app.listen(PORT, function () { 
    console.log("start serwera na porcie " + PORT )
})