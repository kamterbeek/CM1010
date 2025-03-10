// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;
var selectedGraph = null; // Variable to store the currently selected graph
var csvData = null; // Variable to store CSV data

function setup() {
    // Create a canvas to fill the content div from index.html.
    var c = createCanvas(1024, 576);
    c.parent('app');

    // Create a new gallery object
    gallery = new Gallery();

    // Add the visualisation objects here
    gallery.addVisual(new TechDiversityRace("tech-diversity-race"));
    gallery.addVisual(new TechDiversityGender("tech-diversity-gender"));
    gallery.addVisual(new PayGapByJob2017("pay-gap-by-job-2017"));
    gallery.addVisual(new PayGapTimeSeries("pay-gap-timeseries"));
    gallery.addVisual(new ClimateChange("climate-change"));

    // Set the default selected graph
    selectedGraph = gallery.getVisualById("tech-diversity-gender");

    // Event listener for the "Upload CSV" button
    document.getElementById('uploadButton').addEventListener('click', handleFileUpload);

    // Event listener for dropdown menu selection
    document.getElementById('graphSelect').addEventListener('change', function () {
        const selectedGraphType = document.getElementById('graphSelect').value;
        selectedGraph = getGraphByType(selectedGraphType);
    });
}

function draw() {
    background(255);

    // If CSV data is available, render the CSV graph, else render selected graph
    if (csvData && selectedGraph != null) {
        renderGraph(csvData, selectedGraph);
    }
    else if (selectedGraph != null) {
        selectedGraph.draw();
    }
}

// Function to handle the file upload and CSV parsing
function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        // Read the file using FileReader
        const reader = new FileReader();
        reader.onload = function(event) {
            // Parse CSV using PapaParse (or any other CSV parser)
            csvData = Papa.parse(event.target.result, {
                header: true,
                skipEmptyLines: true,
            });

            // Display the CSV filename
            const filename = file.name;
            document.getElementById('visualization').innerHTML = `<h2>Data from: ${filename}</h2>`;

            // Call the appropriate graph function based on selected dropdown value
            const selectedGraphType = document.getElementById('graphSelect').value;
            selectedGraph = getGraphByType(selectedGraphType);
        };
        reader.readAsText(file);
    }
}

// Function to return the appropriate graph based on the selected graph type
function getGraphByType(graphType) {
    switch (graphType) {
        case 'tech-diversity-gender':
            return gallery.getVisualById("tech-diversity-gender");
        case 'pay-gap-timeseries':
            return gallery.getVisualById("pay-gap-timeseries");
        case 'climate-change':
            return gallery.getVisualById("climate-change");
        case 'tech-diversity-race':
            return gallery.getVisualById("tech-diversity-race");
        default:
            return null;
    }
}

// Function to render the selected graph using the uploaded CSV data
function renderGraph(data, graph) {
    // Render the graph with the new CSV data
    graph.draw(data);
}

// Gallery class (assuming it manages the visualizations)
class Gallery {
    constructor() {
        this.visuals = [];
        this.selectedVisual = null;
    }

    addVisual(visual) {
        this.visuals.push(visual);
    }

    getVisualById(id) {
        return this.visuals.find(visual => visual.id === id);
    }
}

// Visualization classes (TechDiversityGender, TechDiversityRace, etc.)
class TechDiversityGender {
    constructor(id) {
        this.id = id;
        this.data = null;
    }

    draw() {
        console.log("Rendering Tech Diversity: Gender graph", this.data);
    }
}

class TechDiversityRace {
    constructor(id) {
        this.id = id;
        this.data = null;
    }

    draw() {
        console.log("Rendering Tech Diversity: Race graph", this.data);
    }
}

class PayGapByJob2017 {
    constructor(id) {
        this.id = id;
        this.data = null;
    }

    draw() {
        console.log("Rendering Pay Gap By Job 2017 graph", this.data);
    }
}

class PayGapTimeSeries {
    constructor(id) {
        this.id = id;
        this.data = null;
    }

    draw() {
        console.log("Rendering Pay Gap Time Series graph", this.data);
    }
}

class ClimateChange {
    constructor(id) {
        this.id = id;
        this.data = null;
    }

    draw() {
        console.log("Rendering Climate Change graph", this.data);
    }
}
