// document.location.hash = '#tab-bus';
document.location.hash = '#tab-ov';

let tabs = document.querySelectorAll('.navbar-tab')
for (let i=0; i<tabs.length; i++) {
    // tabs[i].setAttribute('data-index', i.toString());
    tabs[i].onclick = function() {
        for (let i=0; i<tabs.length; i++) {
            tabs[i].classList.remove('current-tab')
        }
        this.classList.add('current-tab');
    }
}

respondToVisibility = function(element, callback) {
    let options = {
        root: document.documentElement
    }
    let observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                callback(entry.intersectionRatio > 0);
            });
        }, options);
    observer.observe(element);
}