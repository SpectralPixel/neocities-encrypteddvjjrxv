// thanks punkwasp! i "borrowed" this from your site and remixed it a bit to fit my needs

const feedURL = 'https://status.cafe/users/encrypteddvjjrxv.atom';

fetch(feedURL).then(response=>response.text()).then(str=>new window.DOMParser().parseFromString(str, "text/xml")).then(data=>{
    const entries = data.querySelectorAll("entry");
    let html = ``;

    entries.forEach(el=>{
        let title = el.querySelector("title").innerHTML.slice(0, 18).trim(); // username + emoji (adjust slice value depending on the length of your name)
        let content = el.querySelector("content").textContent.trim();
        let dateString = el.querySelector("published").innerHTML.slice(0, 10);
        let year = dateString.slice(0, 4);
        let month = dateString.slice(5, 7);
        let day = dateString.slice(8, 10);
        html += `
                <div>
                    <p>&lsqb;<i>${dateString}</i>&rsqb;</p>
                    <p>${content}</p>
                </div>
              `;
    }
    )
    document.getElementById("status-cafe-feed").innerHTML = html;
}
)