<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Ana Sayfa</title>
</head>

<body style="font-family: Arial, sans-serif; padding: 20px;">

    <h2 id="title">Loading...</h2>

    <p id="description"></p>

    <img id="logo" style="height: 80px; display:none;">

    <script>
        // API'yi burada çağırıyoruz
	     fetch("/api/settings")
            .then(response => response.json())
            .then(data => {
                console.log("API DATA:", data);

                // Blade içindeki elementlere yaz
                   document.getElementById("title").innerText = data.data.header_text;
                   document.getElementById("description").innerText = data.data.meta_description;
                   if (data.data.logo_path) {
                   document.getElementById("logo").src = "/" + data.data.logo_path; 
                   document.getElementById("logo").style.display = "block";
                }
            })
            .catch(err => {
                document.getElementById("title").innerText = "HATA: API'ye ulaşılamıyor";
                console.error(err);
            });
    </script>

</body>

</html>
