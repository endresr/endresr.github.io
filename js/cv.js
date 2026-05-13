function renderYearMarkers(container,minDate,maxDate,widthScaler) {
    const startYear = new Date(minDate).getFullYear();
    const endYear = new Date(maxDate).getFullYear();

    for (let year = startYear; year <= endYear; year++) {
        // Find the timestamp for Jan 1st of that year
        const yearDate = new Date(`${year}-01-01`).getTime();
        const left = (yearDate - minDate) * widthScaler;

        // Create the vertical line
        const marker = document.createElement('div');
        marker.className = 'year-marker';
        marker.style.left = `${left}px`;
        
        // Add the label (e.g., "2021")
        const label = document.createElement('span');
        label.innerText = year;
        marker.appendChild(label);

        container.appendChild(marker);
    }
}

function createBar(item,minDateInMs,start,end,isTimeline,widthScaler) {
    let leftOffset = (start - minDateInMs) * widthScaler;
    let widthOfBar = (end-start)*widthScaler;
    
    let bar = document.createElement('div');
    bar.className = `timeline-bar ${item.type}-bar`;

    barTextContainer = document.createElement('p');
    if (isTimeline) {
        bar.style.left = `${leftOffset}px`;
        bar.style.width = `${widthOfBar}px`;

        barTextContainer.innerText = item.selskapShortName;
    } else {
        barTextContainer.innerText = item.selskap;
    }
    
    bar.appendChild(barTextContainer);
    
    return bar
}

function drawCategoryMarker(container,category,verticalOffset,widthOfContainer) {
    let marker = document.createElement('div');
    marker.className = 'category-marker';
    marker.style.top = `${verticalOffset}px`;
    marker.style.width = `${widthOfContainer}px`;
    container.appendChild(marker);
}

function populateCategory(container,items,categoryOffset,minDateInMs,maxDateInMs,widthScaler){
    const barHeight = 40;
    const rowSep = 20;

    let lanes = [minDateInMs];
    let laneNumb;
    items.forEach(item =>{
        let start = new Date(item.start).getTime();
        let end = item.slutt ? new Date(item.slutt).getTime() : maxDateInMs;
        laneNumb = -1;

        for (let i = 0; i < lanes.length; i++) {
            if (lanes[i] <= start) {
                lanes[i] = end;
                laneNumb = i;

                break
            }
        }
        if (laneNumb == -1) {
            lanes.push(end);
            laneNumb = lanes.length -1;
        }
        let bar = createBar(item,minDateInMs,start,end,true,widthScaler);
        let yPosBar = laneNumb*(barHeight+rowSep)+rowSep+categoryOffset;

        bar.style.top = `${yPosBar}px`;

        bar.addEventListener('click', () => showDetails(item));

        container.appendChild(bar);
    });
    return categoryOffset + (lanes.length)*(barHeight+rowSep)+rowSep;
}

function renderCategories(container,category,items,categoryOffset,minDateInMs,maxDateInMs,totalWidth,widthScaler) {

    drawCategoryMarker(container,category,categoryOffset,totalWidth); 

    return populateCategory(container,items,categoryOffset,minDateInMs,maxDateInMs,widthScaler)
}

function renderTimeline(container) {
    const minDate = new Date("2012-01-01").getTime(); 
    const maxDate = new Date().getTime();
    const totalRange = maxDate - minDate;
    const widthOfYearInPx = 300
    const totalWidth = (totalRange / (1000*60*60*24*365))*widthOfYearInPx;
    const widthScaler = totalWidth / totalRange;
    
    categories = ["utdanning","arbeid","prosjekt"];
    categoryOffset = 30;

    for (let i = 0; i < categories.length; i++) {
        let experienceList = cvData.filter(item => item.type == categories[i]).sort((a,b)=> new Date(a.start)-new Date(b.start));
        categoryOffset = renderCategories(container,categories[i],experienceList,categoryOffset,minDate,maxDate,totalWidth,widthScaler);
    }
    container.style.height = `${categoryOffset}px`;
    
    renderYearMarkers(container,minDate, maxDate, widthScaler)
    container.scrollLeft = container.scrollWidth;
}

function renderCVList(container) {
    


}

function renderCV() {
    container = document.getElementById('cv-container');
    let checkIfTimeline = container.getAttribute('data-display');
    if (checkIfTimeline == "timeline") {
        renderTimeline(container);
    } else {
        renderCVList(container);
    }
}

function showDetails(item) {
    const drawer = document.getElementById('detail-drawer');
    const overlay = document.getElementById('drawer-overlay');
    
    // 1. Inject the data
    document.getElementById('detail-title').innerText = item.rolle;
    document.getElementById('detail-subtitle').innerText = item.selskap;
    let start = new Date(item.start);
    let slutt = item.slutt ? new Date(item.slutt) : new Date().getTime();
    document.getElementById('detail-date').innerText = `${start.toLocaleDateString("nb-NO", {year: "numeric", month : "long"}).split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')} \u2014 ${item.slutt ? slutt.toLocaleDateString("nb-NO", {year: "numeric", month : "long"}).split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') : 'Nåværende'}`;
    document.getElementById('detail-body').innerHTML = item.beskrivelse; // Assumes HTML string
    MathJax.typeset();
    

    // 2. Show the UI
    drawer.classList.add('open');
    overlay.classList.add('visible');
}

// Function to close
function closeDrawer() {
    document.getElementById('detail-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('visible');
}


// Bonus: Close with 'Esc' key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
});