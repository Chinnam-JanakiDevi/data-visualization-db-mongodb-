
// bar chart: Show the trend of intensity over time.

fetch('http://localhost:5000/api/insights')
  .then(response => response.json())
  .then(data => {
    // Parse timestamps as Date objects
    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    data.forEach(d => {
      d.timestamp = parseTime(d.published);
    });

    // Set up the SVG container
    const svgWidth = 600;
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('#bar-chart').append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.timestamp))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.intensity)])
      .range([height, 0]);

    // Create bars based on the data
    svg.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('x', d => xScale(d.timestamp))
      .attr('y', d => yScale(d.intensity))
      .attr('width', width / data.length) // Adjust the width based on the number of data points
      .attr('height', d => height - yScale(d.intensity))
      .attr('fill', 'steelblue');

    // Add X and Y axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y")));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add labels
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Published Timestamp');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Intensity');
  })
  .catch(error => console.error('Error fetching data:', error));



// Line Chart: Show the trend of intensity over time.

fetch('http://localhost:5000/api/insights')
  .then(response => response.json())
  .then(data => {
    // Parse timestamps as Date objects
    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    data.forEach(d => {
      d.timestamp = parseTime(d.published);
    });

    // Set up the SVG container
    const svgWidth = 600;
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('#chart-container').append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.timestamp))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.intensity)])
      .range([height, 0]);

    // Create line based on the time series data
    const line = d3.line()
      .x(d => xScale(d.timestamp))
      .y(d => yScale(d.intensity));

    // Append the line to the SVG
    svg.append('path')
      .data([data])
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add X and Y axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add labels
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Published Timestamp');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Intensity');
  })
  .catch(error => console.error('Error fetching data:', error));

//bar chart intensity vs sector

fetch('http://localhost:5000/api/insights')
  .then(response => response.json())
  .then(data => {
    // Assuming 'sector' is the field in your data representing different sectors
    const sectors = Array.from(new Set(data.map(d => d.sector)));

    // Set up the SVG container
    const svgWidth = 800;
    const svgHeight = 600;
    const margin = { top: 20, right: 30, bottom: 100, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('#int_vs_sect').append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3.scaleBand()
      .domain(sectors)
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.intensity)])
      .range([height, 0]);

    // Create bars based on the data grouped by sector
    svg.selectAll('rect')
      .data(sectors)
      .enter().append('rect')
      .attr('x', d => xScale(d))
      .attr('y', d => yScale(d3.mean(data.filter(item => item.sector === d), d => d.intensity)))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d3.mean(data.filter(item => item.sector === d), d => d.intensity)))
      .attr('fill', 'steelblue')
      .on('mouseover', function (event, d) {
        // Add tooltip or any additional interaction
        console.log(`Sector: ${d}`);
      });

    // Add X and Y axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add labels
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 80})`)
      .style('text-anchor', 'middle')
      .text('Sector');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Intensity');
  })
  .catch(error => console.error('Error fetching data:', error));


//likelihood 
// public/script.js

fetch('http://localhost:5000/api/insights')
  .then(response => response.json())
  .then(data => {
    // Count the occurrences of each likelihood value
    const likelihoodCounts = {};
    data.forEach(d => {
      const likelihood = d.likelihood;
      likelihoodCounts[likelihood] = (likelihoodCounts[likelihood] || 0) + 1;
    });

    // Convert likelihoodCounts to an array of objects
    const likelihoodData = Object.entries(likelihoodCounts).map(([likelihood, count]) => ({
      likelihood: +likelihood, // Convert likelihood back to a number
      count: count
    }));

    // Set up the SVG container
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('#likelihood').append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3.scaleBand()
      .domain(likelihoodData.map(d => d.likelihood))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(likelihoodData, d => d.count)])
      .range([height, 0]);

    // Create bars based on the data
    svg.selectAll('rect')
      .data(likelihoodData)
      .enter().append('rect')
      .attr('x', d => xScale(d.likelihood))
      .attr('y', d => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.count))
      .attr('fill', 'steelblue');

    // Add X and Y axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add labels
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Likelihood');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Count');
  })
  .catch(error => console.error('Error fetching data:', error));


//pie chart :relevance across different categories or topics.
// Fetch data from the API
fetch('http://localhost:5000/api/insights')
  .then(response => response.json())
  .then(data => {
    const uniqueSectors = [...new Set(data.map(d => d.sector))];
    const colorScale = d3.scaleOrdinal().domain(uniqueSectors).range(d3.schemeCategory10);
    // Count the occurrences of each relevance value
    const relevanceCounts = {};
    data.forEach(d => {
      const relevance = d.relevance;
      relevanceCounts[relevance] = (relevanceCounts[relevance] || 0) + 1;
    });

    // Convert relevanceCounts to an array of objects
    const relevanceData = Object.entries(relevanceCounts).map(([relevance, count]) => ({
      relevance: relevance,
      count: count
    }));

    // Set up the SVG container
    const svgWidth = 800;
    const svgHeight = 400;
    const radius = Math.min(svgWidth, svgHeight) / 2;

    const svg = d3.select('#relevance').append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .append('g')
      .attr('transform', `translate(${svgWidth / 2},${svgHeight / 2})`);

    // Create a pie chart based on the data
    const pie = d3.pie().value(d => d.count);
    const data_ready = pie(relevanceData);

    // Set up color scale
    const color = d3.scaleOrdinal()
      .domain(relevanceData.map(d => d.relevance))
      .range(d3.schemeCategory10);

    // Build the pie chart
    svg.selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(radius))
      .attr('fill', d => color(d.data.relevance))
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    // Add a legend
    const legend = d3.select('#legend-container').append('ul')
      .selectAll('li')
      .data(relevanceData)
      
      .enter()
      .append('li');
    const legends = d3.select('#combined-legend-container').append('ul')
      .selectAll('li')
      .data(uniqueSectors)
      .enter()
      .append('li');
    legend.append('span')
      .style('background', d => color(d.relevance))
      .style('width', '20px')
      .style('height', '20px')
      .style('display', 'inline-block');

    legend.append('span')
      .text(d => ` ${d.relevance} - ${d.count}`);
    legends.append('span')
      .style('background', d => colorScale(d))
      .style('width', '20px')
      .style('height', '20px')
      .style('display', 'inline-block');

    legends.append('span')
      .text(d => ` ${d}`);

  })

  .catch(error => console.error('Error fetching data:', error));



//---------------
fetch('http://localhost:5000/api/insights')
      .then(response => response.json())
      .then(data => {
        const regionCounts = data.reduce((counts, d) => {
          counts[d.region] = (counts[d.region] || 0) + 1;
          return counts;
        }, {});

        const regionData = Object.entries(regionCounts).map(([region, count]) => ({ region, count }));

        // Bar Chart
        const svgWidth = 900, svgHeight = 450;
        const margin = { top: 20, right: 30, bottom: 70, left: 50 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const svg = d3.select('#region-chart').append('svg')
          .attr('width', svgWidth)
          .attr('height', svgHeight)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
          .domain(regionData.map(d => d.region))
          .range([0, width])
          .padding(0.1);

        const yScale = d3.scaleLinear()
          .domain([0, d3.max(regionData, d => d.count)])
          .range([height, 0]);

        svg.selectAll('rect')
          .data(regionData)
          .enter().append('rect')
          .attr('x', d => xScale(d.region))
          .attr('y', d => yScale(d.count))
          .attr('width', xScale.bandwidth())
          .attr('height', d => height - yScale(d.count))
          .attr('fill', 'steelblue');

        svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(xScale))
          .selectAll('text')
          .attr('transform', 'rotate(-45)')
          .style('text-anchor', 'end');

        svg.append('g')
          .call(d3.axisLeft(yScale));

          svg.append('text')
          .attr('transform', `translate(${width / 2},${height + margin.top +50})`)  // Adjust the '55' value for additional downward movement
          .style('text-anchor', 'middle')
          .text('Region');

        svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - margin.left)
          .attr('x', 0 - height / 2)
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .text('Event Count');

       
      })
      .catch(error => console.error('Error fetching data:', error));
  