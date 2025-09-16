Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "https://image-classifier-backend-lc9n.onrender.com/classify_image",
        //url: "http://127.0.0.1:5000/classify_image", // send to Flask API, use it when not sending to nginix
        //url: "/api/classify_image",// send to Flask API, use it when sending to nginix
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Drop files here or click to upload",
        autoProcessQueue: false, // keep manual trigger via button
        paramName: "image_data", // Flask will read request.form['image_data']
        transformFile: function (file, done) {
            let reader = new FileReader();
            reader.onload = function (event) {
                file.image_data = event.target.result; // store base64
                done(file);
            };
            reader.readAsDataURL(file);
        },
        sending: function (file, xhr, formData) {
            formData.append("image_data", file.image_data); // append base64
        }
    });

    $("#submitBtn").on('click', function () {
        dz.processQueue(); // manually start upload
    });


    dz.on("addedfile", function () {
        if (dz.files[1] != null) {
            dz.removeFile(dz.files[0]);
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;

        var url = "https://image-classifier-backend-lc9n.onrender.com/classify_image";
        //var url = "http://127.0.0.1:5000/classify_image"; //use it when not sending to nginix
        //var url = "/api/classify_image";//use it when sending to nginix

        $.post(url, {
            image_data: file.dataURL
        }, function (data, status) {
            /* 
            Below is a sample response if you have two faces in an image lets say virat and roger together.
            Most of the time if there is one person in the image you will get only one element in below array
            data = [
                {
                    class: "viral_kohli",
                    class_probability: [1.05, 12.67, 22.00, 4.5, 91.56],
                    class_dictionary: {
                        lionel_messi: 0,
                        maria_sharapova: 1,
                        roger_federer: 2,
                        serena_williams: 3,
                        virat_kohli: 4
                    }
                },
                {
                    class: "roder_federer",
                    class_probability: [7.02, 23.7, 52.00, 6.1, 1.62],
                    class_dictionary: {
                        lionel_messi: 0,
                        maria_sharapova: 1,
                        roger_federer: 2,
                        serena_williams: 3,
                        virat_kohli: 4
                    }
                }
            ]
            */
            console.log(data);
            if (!data || data.length == 0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();
                $("#error").show();
                return;
            }
            let players = ["Jennifer_lawrence", "Narendra_modi", "cristiano_ronaldo", "shradha_kapoor", "virat_kohli"];

            let match = null;
            let bestScore = -1;
            for (let i = 0; i < data.length; ++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if (maxScoreForThisClass > bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }
            if (match) {
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();
                $("#resultHolder").html($(`[data-player="${match.class}"`).html());
                let classDictionary = match.class_dictionary;
                for (let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName;
                    $(elementName).html(proabilityScore);
                }
            }
            // dz.removeFile(file);            
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();
    });
}

$(document).ready(function () {
    console.log("ready!");
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});