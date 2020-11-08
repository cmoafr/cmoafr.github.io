const empty = "g0";
const unknown = "gz";
var classification, emojis={};
var width = 20;
var height = 20;
var selected = empty;

function get_emojis() {
    var r = new XMLHttpRequest();
    r.open("GET", "https://cmoafr.github.io/rededitor/emojis.json");
    r.responseType = "json";
    r.send();
    r.onload = function() {
        emojis = r.response;
        get_classification(); // TODO: Use async
    }
}

function get_classification() {
    var r = new XMLHttpRequest();
    r.open("GET", "https://cmoafr.github.io/rededitor/classification.json");
    r.responseType = "json";
    r.send();
    r.onload = function() {
        classification = r.response;
        load_emojis(); // TODO: Use async
    }
}

function load_emojis() {
    var count = 0;
    for (name in emojis) {
        count += 1;
    }
    var list = {};
    var i = 0;
    for (name in emojis) {
        var img = document.createElement("img");
        img.setAttribute("src", emojis[name]);
        img.onload = function() {
            i += 1;
            document.body.innerHTML = "Preloading emojis (" + i + "/" + count + "). Please wait.";
            if (i == count) {
                delete(list);
                create_doc(); // TODO: Use async
            }
        };
        list[name] = img;
    }
}

function create_doc() {
    
    document.body.innerHTML = "";
    var h = document.createElement("h1");
    h.appendChild(document.createTextNode("Commands"));
    document.body.appendChild(h);
    var commands_div = document.createElement("div");
    commands_div.appendChild(document.createTextNode("TODO"));
    document.body.appendChild(commands_div);
    
    
    var h = document.createElement("h1");
    h.appendChild(document.createTextNode("Selector"));
    document.body.appendChild(h);
    var select_div = document.createElement("div");
    select_div.setAttribute("id", "selector");
    select_div.setAttribute("name", "main");
    document.body.appendChild(select_div);
    generate_classification(classification, select_div);
    
    var h = document.createElement("h1");
    h.appendChild(document.createTextNode("Editor"));
    document.body.appendChild(h);
    var table = document.createElement("table");
    for (var i = 0; i < height; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < width; j++) {
            var th = document.createElement("th");
            var btn = document.createElement("button");
            btn.setAttribute("class", "editor");
            btn.setAttribute("name", empty);
            btn.setAttribute("row", i);
            btn.setAttribute("column", j);
            btn.addEventListener("click", function() {set_emoji(this)});
            var img = document.createElement("img");
            img.setAttribute("src", emojis[empty]);
            btn.appendChild(img);
            th.appendChild(btn);
            tr.appendChild(th);
        }
        table.appendChild(tr);
    }
    document.body.appendChild(table);

    treeLists = document.getElementsByTagName("li");
    for (var i=0; i < treeLists.length; i++) {
        treeLists[i].addEventListener("click", function(e) {
            e.stopPropagation();
            this.querySelector(".treelist").classList.toggle("active");
        });
    }

}

function generate_classification(classification, parent) {
    var ul = document.createElement("ul");
    ul.setAttribute("class", (parent.id == "selector") ? "treelist active" : "treelist");
    for (name in classification) {
        var li = document.createElement("li");
        li.setAttribute("name", name);
        if (name == "emojis") {
            for (i = 0; i < classification[name].length; i++) {
                var emoji = classification[name][i];
                var btn = document.createElement("button");
                btn.setAttribute("class", "select");
                btn.setAttribute("name", emoji);
                btn.addEventListener("click", function(e) {select_emoji(this, e)});
                var hovercontainer = document.createElement("div");
                hovercontainer.setAttribute("class", "hovercontainer");
                var img = document.createElement("img");
                img.setAttribute("src", emojis[emoji]);
                img.setAttribute("class", "selector");
                hovercontainer.appendChild(img);
                var hoverbox = document.createElement("div");
                hoverbox.setAttribute("class", "hoverbox");
                var hovertext = document.createElement("div");
                hovertext.setAttribute("class", "hovertext");
                hovertext.appendChild(document.createTextNode(emoji));
                hoverbox.appendChild(hovertext);
                hovercontainer.appendChild(hoverbox);
                btn.appendChild(hovercontainer);
                li.appendChild(btn);
            }
        } else {
            li.appendChild(document.createTextNode(name));
            generate_classification(classification[name], li);
        }
        ul.appendChild(li);
    }
    parent.appendChild(ul);
}

function select_emoji(btn, e) {
    e.stopPropagation();
    selected = btn.name;
}

function set_emoji(btn) {
    btn.setAttribute("name", selected);
    btn.children[0].setAttribute("src", emojis[selected]);
}



function main() {
    // TODO: Use async
    get_emojis();
    //get_classification();
    //load_emojis();
    //create_doc();
}

main();