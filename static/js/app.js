// Define the URL of the JSON data
const jsonURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const metadatacontainer = d3.select("#sample-metadata");
// Load data from the JSON file
d3.json(jsonURL).then(function(data) {
    // Extract data from the JSON
    const samples = data.samples;
    const otu_ids = samples.map(sample => sample.otu_ids);
    const sample_values = samples.map(sample => sample.sample_values);
    const otu_labels = samples.map(sample => sample.otu_labels);

    // Create a dropdown menu
    const dropdown = d3.select("#dropdown");

    // Populate the dropdown options with sample IDs
    const sampleIDs = data.names;
    sampleIDs.forEach(sampleID => {
        dropdown
            .append("option")
            .text(sampleID)
            .attr("value", sampleID);
    });

    // Initialize the chart with the first sample
    const initialSample = sampleIDs[0];
    updateChart(initialSample);


    
    // Function to update the chart based on selected sample
    function updateChart(selectedSample) {
        const sampleIndex = sampleIDs.indexOf(selectedSample);
        const top10_otu_ids = otu_ids[sampleIndex].slice(0, 10);
        const top10_sample_values = sample_values[sampleIndex].slice(0, 10);
        const top10_otu_labels = otu_labels[sampleIndex].slice(0, 10);

        // Create the horizontal bar chart
        const barTrace = {
            x: top10_sample_values.reverse(),
            y: top10_otu_ids.map(otu_id => `OTU ${otu_id}`).reverse(),
            text: top10_otu_labels.reverse(),
            type: "bar",
            orientation: "h"
        };

        const barData = [barTrace];

        const barLayout = {
            title: `Top 10 OTUs for ${selectedSample}`,
            xaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bar", barData, barLayout);
        // Create Bubble chart for each sample
        const bubbleTrace = {
            x: top10_otu_ids,
            y: top10_sample_values,
            text: top10_otu_labels,
            mode: 'markers',
            marker: {
                size: top10_sample_values,
                color: top10_otu_ids,
                colorscale: 'Earth',
                opacity: 0.7
            }
        };
    
        const bubbleData = [bubbleTrace];
    
        const bubbleLayout = {
            title: `Bubble Chart for ${selectedSample}`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };
    
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        //Obtain metadata and display in metadata container.
        metadatacontainer.html("");        
        const metadata = data.metadata[sampleIndex];
        for (const key in metadata) {
            if (metadata.hasOwnProperty(key)) {
                metadatacontainer.append('p').text(`${key}: ${metadata[key]}`)
                }
            }
    }

    // Event listener for dropdown change
    dropdown.on("change", function() {
        const selectedSample = d3.select(this).property("value");
        updateChart(selectedSample);
    });
});
