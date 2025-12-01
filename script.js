async function upload(){
    const file = document.getElementById("image").files[0];
    const form = new FormData();
    form.append("bill", file);

    const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: form
    });

    document.getElementById("response").innerText = JSON.stringify(await res.json(), null, 2);
}
