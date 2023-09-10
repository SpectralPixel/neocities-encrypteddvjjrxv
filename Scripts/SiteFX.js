// Get all content elements
let contentElements = document.getElementsByClassName("content");
let originalContentWidths = [];
let originalContentHeights = [];


for (let i = 0; i < contentElements.length; i++){
    // store all of the element's original widths
    originalContentWidths.push(contentElements[i].offsetWidth);
    originalContentHeights.push(contentElements[i].offsetHeight);

    // hide all of the contents in this div
    let children = contentElements[i].children;
    for (let c = 0; c < children.length; c++){
        children[c].style.display = "none";
    }
}

// for debugging purposes: to check if the arrays are populated
for (let i = 0; i < contentElements.length; i++){
    console.log(contentElements[i]);
    console.log(originalContentWidths[i]);
    console.log(originalContentHeights[i]);
}

console.log("- - - - -")

let animationLength = 500; // in ms
let animationStep = 10; // in ms
let animationKeyframes = 20;

let completedSteps = 1;
let maxSteps = animationLength / animationStep;
let animationValue = 0;
function animate(){
    // check if the animation is completed
    if (completedSteps >= maxSteps){
        clearInterval(animation);
        cleanUpAnimation();
    }

    // calculate new animation value
    animationValue = 1 - (1 / Math.pow(2, completedSteps / (maxSteps / animationKeyframes)));
    //console.log(Math.round(animationValue * 1000000000) / 1000000000);

    // multiply the orignal width of all elements by the animValue
    for (let i = 0; i < contentElements.length; i++){
        let element = contentElements[i];
        element.style.width = (originalContentWidths[i] * animationValue).toString() + "px";
        element.style.left = (originalContentWidths[i] * (1 - animationValue) / 2).toString() + "px";
        element.style.minHeight = (originalContentHeights[i]).toString() + "px";
        //console.log(element.style.width);
    }

    // increment the number of completed steps
    completedSteps++;
}

function cleanUpAnimation() {
    setTimeout(function(){
        for (let i = 0; i < contentElements.length; i++){
            let element = contentElements[i];
            element.style.width = null;
            element.style.left = null;
            element.style.minHeight = null;

            let children = contentElements[i].children;
            for (let c = 0; c < children.length; c++){
                children[c].style.display = null;
            }

            console.log("cleaned up")
        }
    }, 50);
}

let animation = setInterval(animate, animationStep);