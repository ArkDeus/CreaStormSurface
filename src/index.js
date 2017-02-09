/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

// Import socket.io
import io from 'socket.io-client';

// Import JQuery
import $ from 'jquery/dist/jquery.min';

// Import TUIOManager
import TUIOManager from 'tuiomanager/core/TUIOManager';

// Import ImageWidget
import ImageWidget from './ImageWidget/ImageWidget';

//Import TagListWidget
import TagListWidget from './TagListWidget/TagListWidget'

/** TUIOManager starter **/
const tuioManager = new TUIOManager();
tuioManager.start();

/** App Code **/
var socketURL = 'http://localhost:8080/';
const socketIOClient = io(socketURL+'SurfaceService');
var imageWidgets = [];
const tagListWidget = new TagListWidget(0,0,1920,1080);
var _URL = window.URL || window.webkitURL;


const buildApp = () => {
    $('body').append(tagListWidget.domElem);
    //const imageWidget = new ImageWidget(0, 0, 250, 333, 'assets/IMG_20150304_201145.jpg');
    //$('body').append(imageWidget.domElem);
    var projects = document.getElementById("projectSelector");
  socketIOClient.emit('getProjectList');
  socketIOClient.on('returnProjectList', function (projectList) {
    for (var i = 0; i < projectList.length; i++) {
      console.log(i+'eme projet');
      var t = document.querySelector('#projectTemplate');
      // Populate the src at runtime.
      t.content.querySelector('div img').src = socketURL+'Projects/' + projectList[i][0] + '/' + projectList[i][1];
      t.content.querySelector('div p').textContent = projectList[i][0];
      var clone = document.importNode(t.content, true);
      projects.appendChild(clone);
      var child = projects.querySelectorAll('div')[i];
      child.setAttribute('onclick','loadProject(\"'+projectList[i][0]+'\")');
      console.log(child);
    }
  });


};

$(window).ready(() => {
  buildApp();
});


function loadProject(projectName) {
    var projects = document.getElementById("projectSelector");
    projects.innerHTML = "";
    var title = document.getElementById("title");
    title.innerHTML="";
    var workbench = document.getElementById("workbench");
    workbench.innerHTML = "";
    console.log(projectName);
    socketIOClient.emit("getImagesFromProject", projectName);
    socketIOClient.on("returnAllImages", function (images) {
        console.log(images);
        for (var i = 0; i < images.length; i++) {
            var _URL = window.URL || window.webkitURL;
            workbench.innerHTML += "<img src='"+socketURL+"Projects/" + projectName + "/" + images[i] + "'/>";
            var imgsrc = socketURL+"Projects/" + projectName + "/" + images[i];

        }
        for (var i = 0; i < workbench.children.length; i++) {
            var image = workbench.children[i];
            image.style.position = "absolute";
            var top = Math.floor(Math.random() * (1000 - 10 + 1-500)) + 10;
            var left = Math.floor(Math.random() * (1900 - 10 + 1-500)) + 10;
            var rotation = Math.floor(Math.random() * (360 + 1));
            image.style.top = top + "px";
            image.style.left = left + "px";
            image.style.transform = "rotate(" + rotation + "deg)";
            console.log(image);
        }
    });
}

window.loadProject = loadProject;
