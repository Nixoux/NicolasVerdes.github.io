window.onload = function() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        const collapsedText = box.querySelector('.collapsed-text');
        collapsedText.style.display = 'none'; // Initially hide all collapsed-text elements
    });
};

function toggleMode() {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.setAttribute('data-theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
    }

    // Update styles for all boxes based on the new theme
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        const collapsedText = box.querySelector('.collapsed-text');
        if (box.classList.contains('collapsed')) {
            // Apply opposite styles to the collapsed box based on the new theme
            if (document.body.getAttribute('data-theme') === 'dark') {
                box.style.backgroundColor = '#ddd';
                collapsedText.style.color = '#222';
            } else {
                box.style.backgroundColor = '#222';
                collapsedText.style.color = '#ddd';
            }
        } else {
            // Reset box to default theme styles
            box.style.backgroundColor = ''; // Reset to default
            collapsedText.style.color = ''; // Reset to default
        }
    });
}

function toggleBox(boxId) {
    let box = document.getElementById(boxId);
    let toggleButton = box.querySelector('.toggle img'); // Select the image inside the toggle button
    let collapsedText = box.querySelector('.collapsed-text'); // Select the collapsed-text element

    box.classList.toggle('collapsed');
    
    // Update the styles and image source based on the collapsed state
    if (box.classList.contains('collapsed')) {
        toggleButton.src = 'img_resize-expand.png'; // Image when the box is collapsed
        collapsedText.style.display = 'block'; // Make collapsed-text visible

        // Check the current theme and apply opposite styles to the collapsed box
        if (document.body.getAttribute('data-theme') === 'dark') {
            box.style.backgroundColor = '#ddd';
            collapsedText.style.color = '#222';
        } else {
            box.style.backgroundColor = '#222';
            collapsedText.style.color = '#ddd';
        }
    } else {
        toggleButton.src = 'img_collapse.png'; // Image when the box is expanded
        collapsedText.style.display = 'none'; // Hide collapsed-text

        // Reset box to default theme styles
        if (document.body.getAttribute('data-theme') === 'dark') {
            box.style.backgroundColor = ''; // Reset to default
            collapsedText.style.color = ''; // Reset to default
        } else {
            box.style.backgroundColor = ''; // Reset to default
            collapsedText.style.color = ''; // Reset to default
        }
    }

    adjustBoxFlex();
}

document.addEventListener("DOMContentLoaded", function() {
    // Handle collapsible lists
    var collapsibleLists = document.getElementsByClassName("collapsible_list");
    
    for (var i = 0; i < collapsibleLists.length; i++) {
        collapsibleLists[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

    // Ensure box flex adjustment runs on page load
    adjustBoxFlex();
});

function adjustBoxFlex() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        if (box.classList.contains('collapsed')) {
            box.style.flex = '0 1 0%';
        } else {
            box.style.flex = '1';
        }
    });
}
const regionMapping = {
    "HUN": "Huntingdonshire",
    "HEF": "Herefordshire",
    "DUR": "Durham",
    "CHS": "Cheshire",
    "BDF": "Bedfordshire",
    "CAM": "Cambridgeshire",
    "DBY": "Derbyshire",
    "DOR": "Dorset",
    "HAM": "Hampshire",
    "OXF": "Oxfordshire",
    "BRK": "Berkshire",
    "NOT": "Nottinghamshire",
    "SAL": "Shropshire",
    "NFK": "Norfolk",
    "NTH": "Northamptonshire",
    "BKM": "Buckinghamshire",
    "DEV": "Devon",
    "LAN": "Lancashire",
    "SXW": "West Sussex",
    "SUR": "Surrey",
    "LIN": "Lincolnshire",
    "WIL": "Wiltshire",
    "COR": "Cornwall",
    "WAR": "Warwickshire",
    "SOM": "Somerset",
    "WOR": "Worcestershire",
    "STS": "Staffordshire",
    "LON": "London",
    "YKS": "Yorkshire",
    "WES": "Westmorland",
    "LEI": "Leicestershire & Rutland",
    "ESS": "Essex",
    "SFK": "Suffolk",
    "HRT": "Hertfordshire",
    "GLS": "Gloucestershire",
    "NBL": "Northumberland",
    "CUL": "Cumberland"
};

function processLetters() {
    const inputText = document.getElementById('lettersInput').value;
    const parsedData = parseText(inputText);

    // Create distinct tables for districts, regions, and settlements
    const { districtTable, regionTable, settlementTable } = createDistinctTables(parsedData);
    
    checkForUnmatchedRegionsAndDistricts(regionTable, districtTable, parsedData.missingRegions);
    checkForUnmatchedSettlements(settlementTable);
    
    // You can now display or process these tables as needed
    displayOutput(parsedData);
}
function parseText(text) {
    const letters = text.split(/(?=<F)/);

    const data = {
        districtRegionCountry: [],
        settlements: [],
        missingRegions: [] // Add this to track missing regions
    };

    letters.forEach(letter => {
        const district = letter.match(/<L\s*(.*?)>/);
        const regionMatch = letter.match(/<F\s*([A-Z]{3})/);
        const settlement = letter.match(/<AP\s*(.*?)>/) || letter.match(/<SP\s*(.*?)>/);
        const fTagContent = letter.match(/<F\s*(.*?)>/);

        const regionCode = regionMatch ? regionMatch[1] : null;
        const region = regionCode ? regionMapping[regionCode] : null;

        // If region is not found in regionMapping, add it to missingRegions
        if (regionCode && !region) {
            data.missingRegions.push(regionCode);
        }

        // Collect district, region, country, and bloc information
        if (district || region) {
            data.districtRegionCountry.push({
                district: district ? district[1].trim() : null,
                region: region,
                country: "England",
                bloc: "UK"
            });
        }

        // Collect settlements with suggested region and corresponding letter from <F> tag
        if (settlement) {
            data.settlements.push({
                settlement: settlement[1].trim(),
                suggestedRegion: region,
                correspondingLetter: fTagContent ? fTagContent[1].trim() : "N/A"
            });
        }
    });

    return data;
}

function createDistinctTables(parsedData) {
    const uniqueDistricts = new Set();
    const uniqueRegions = new Set();
    const uniqueSettlements = new Set();

    const districtTable = [];
    const regionTable = [];
    const settlementTable = [];

    parsedData.districtRegionCountry.forEach(item => {
        const district = item.district ? item.district.trim() : null;
        const region = item.region ? item.region.trim() : null;

        if (district && !uniqueDistricts.has(district)) {
            uniqueDistricts.add(district);
            districtTable.push({ district });
        }

        if (region && !uniqueRegions.has(region)) {
            uniqueRegions.add(region);
            regionTable.push({ region });
        }
    });

    // Process settlements separately
    parsedData.settlements.forEach(item => {
        const settlement = item.settlement ? item.settlement.trim() : null;
        const correspondingLetter = item.correspondingLetter ? item.correspondingLetter.trim() : null;
        
        if (settlement && !uniqueSettlements.has(settlement)) {
            uniqueSettlements.add(settlement);
            settlementTable.push({ settlement, correspondingLetter });  // Include correspondingLetter here
        }
    });

    // Logging the tables before returning
    console.log('District Table:', districtTable);
    console.log('Region Table:', regionTable);
    console.log('Settlement Table:', settlementTable);

    return {
        districtTable,
        regionTable,
        settlementTable
    };
}

function checkForUnmatchedRegionsAndDistricts(regionTable, districtTable, missingRegions) {
    const xmlInput = document.getElementById('XMLInput').value;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, "text/xml");

    const xmlRegions = Array.from(xmlDoc.querySelectorAll('listPlace[type="region"] placeName')).map(node => node.textContent.trim());
    const xmlDistricts = Array.from(xmlDoc.querySelectorAll('listPlace[type="district"] placeName')).map(node => node.textContent.trim());

    const unmatchedRegions = regionTable.filter(regionItem => !xmlRegions.includes(regionItem.region));
    const unmatchedDistricts = districtTable.filter(districtItem => !xmlDistricts.includes(districtItem.district));

    const outputElement = document.getElementById('DistrictList');
    outputElement.innerHTML = `
        <div class="OutputEntityList">
            ${missingRegions.length > 0 ? `<strong style="color: #dc3545;">Missing Regions in Mapping:</strong>` : `<strong style="color: #28a745;">All Regions are mapped.</strong>`}
            <div class="MissingRegionDisplayStatus">
                ${missingRegions.map(regionCode => `<span class="clickable-region missing" data-region="${regionCode}">${regionCode}</span>`).join('<br>')}
            </div>
        </div>
        <br>
        <div class="OutputEntityList">
            ${unmatchedDistricts.length > 0 ? `<strong style="color: #dc3545;">Unmatched Districts in XML:</strong>` : `<strong style="color: #28a745;">All Districts are Matched.</strong>`}
            <div class="DistrictRegionDisplayStatus">
                ${unmatchedDistricts.map(item => `<span class="clickable-district" data-district="${item.district}">${item.district}</span>`).join('<br>')}
            </div>
        </div>`;
        // Set status based on whether there are unmatched regions or districts
    const statusElement = document.getElementById('outputDistrictStatus');
    if (unmatchedRegions.length === 0 && unmatchedDistricts.length === 0) {
        statusElement.innerHTML = "<strong>The XML file already contains all relevant D | R | C | B information.</strong>";
        statusElement.style.color = "white";
        statusElement.style.backgroundColor = "#28a745";
    } else {
        statusElement.innerHTML = "<strong>Some relevant information may be missing from the XML file.</strong>";
        statusElement.style.color = "white";
        statusElement.style.backgroundColor = "#dc3545";
    }

    // Call function to add event listeners to unmatched regions and districts
    addClickEventListeners();
}





function displayOutput(data) {
    const outputDistrict = document.getElementById('outputDistrict');
    const outputSettlement = document.getElementById('outputSettlement');
    
    // Display District/Region/Country/Bloc in a single line with colors
    const districtRegionCountryDisplay = data.districtRegionCountry.map(item => 
        `<span class="district">${item.district || 'N/A'}</span>, ` +
        `<span class="region">${item.region || 'N/A'}</span>, ` +
        `<span class="country">${item.country}</span>, ` +
        `<span class="bloc">${item.bloc}</span>`
    ).join("<br>");

    // Display Settlements with Suggested Region and Corresponding Letter
    const settlementsDisplay = data.settlements.map(item => 
        `Settlement: ${item.settlement}<br>` +
        `<span style="margin-left: 20px">Corresponding Letter: ${item.correspondingLetter}</span><br><br>`
    ).join("");

    // Display in separate boxes
    outputDistrict.innerHTML = districtRegionCountryDisplay;
    outputSettlement.innerHTML = settlementsDisplay;  // Change to innerHTML to render HTML tags
    
}

function checkForUnmatchedSettlements(settlementTable) {
    const xmlInput = document.getElementById('XMLInput').value;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, "text/xml");

    const xmlSettlements = Array.from(xmlDoc.querySelectorAll('listPlace[type="settlement"] placeName')).map(node => node.textContent.trim());

    const unmatchedSettlements = settlementTable.filter(settlementItem => !xmlSettlements.includes(settlementItem.settlement));

    const unmatchedSettlementsDisplay = unmatchedSettlements.length ? 
        `<div>
            <strong style="color: #dc3545;">Unmatched Settlements:</strong>
            <div class="SettlementDisplayStatus">
                ${unmatchedSettlements.map(item => 
                    `<span class="clickable-settlement" data-settlement="${item.settlement}" data-corresponding-letter="${item.correspondingLetter}">${item.settlement}</span>`
                ).join('<br>')}
            </div>
        </div>` : 
        `<strong style="color: #28a745;">All Settlements are Matched.</strong>`;

    const outputElement = document.getElementById('SettlementList');
    outputElement.innerHTML = unmatchedSettlementsDisplay;

    const statusElement = document.getElementById('outputSettlementStatus');
    if (unmatchedSettlements.length === 0) {
        statusElement.innerHTML = "<strong>The XML file already contains all relevant settlement information.</strong>";
        statusElement.style.color = "white";
        statusElement.style.backgroundColor = "#28a745";
    } else {
        statusElement.innerHTML = "<strong>Some settlement information may be missing from the XML file.</strong>";
        statusElement.style.color = "white";
        statusElement.style.backgroundColor = "#dc3545";
    }

    addSettlementClickEventListeners();
}
function addSettlementClickEventListeners() {
    const settlementElements = document.querySelectorAll('.clickable-settlement');
    settlementElements.forEach(element => {
        element.addEventListener('click', () => {
            const settlementInfo = {
                settlement: element.getAttribute('data-settlement'),
                correspondingLetter: element.getAttribute('data-corresponding-letter')
            };
            showInfoBoxSettlement(settlementInfo);
            logClickedItemSettlement('settlement', settlementInfo.settlement); // Log and display in Potential Matches for settlements
        });
    });
}


function addClickEventListeners() {
    const regionElements = document.querySelectorAll('.clickable-region');
    regionElements.forEach(element => {
        console.log('Attaching click listener to region:', element); // Diagnostic log
        element.addEventListener('click', () => {
            const region = element.getAttribute('data-region');
            const isMapped = !element.classList.contains('missing'); // Check if the region is mapped
            showInfoBox(region, 'region', isMapped);  // First, render the infoBox
            logClickedItem('region', region);  // Then, log and display in Potential Matches
        });
    });

    const districtElements = document.querySelectorAll('.clickable-district');
    districtElements.forEach(element => {
        console.log('Attaching click listener to district:', element); // Diagnostic log
        element.addEventListener('click', () => {
            const district = element.getAttribute('data-district');
            showInfoBox(district, 'district', true); // First, render the infoBox
            logClickedItem('district', district);  // Then, log and display in Potential Matches
        });
    });
}




function showInfoBox(info, type, isMapped) {
    let infoBox = document.getElementById('infoBox');

    if (!infoBox) {
        infoBox = document.createElement('div');
        infoBox.id = 'infoBox';
        infoBox.className = 'infoBox';
        document.querySelector('.outputContainer').appendChild(infoBox); // Append within outputContainer
    }

    const xmlInput = document.getElementById('XMLInput').value;
    const { regions, countries } = parseXML(xmlInput);

    let options = '';
    let additionalMessage = '';
    let mappingStatusMessage = '';

    if (type.toLowerCase() === 'district') {
        additionalMessage = `
            <div class="infoBox-headerB">
                <strong>If there are no matches, then the ${type.charAt(0).toUpperCase() + type.slice(1)} needs to be added to the file.<br> 
                Please select the corresponding Region</strong>
            </div>`;
        options = regions.map(region => `<a href="#" class="dropdown-item" data-id="${region.id}">${region.name}</a>`).join('');
    } else {
        additionalMessage = `
            <div class="infoBox-headerB">
                <strong>If there are no matches, then the ${type.charAt(0).toUpperCase() + type.slice(1)} needs to be added to the file.<br>
                Please select the corresponding Country</strong>
            </div>`;
        options = countries.map(country => `<a href="#" class="dropdown-item" data-id="${country.id}">${country.name}</a>`).join('');
    }

    if (type.toLowerCase() === 'region') {
        mappingStatusMessage = isMapped
            ? `<strong style="color: #28a745;">The region is mapped.</strong>`
            : `<strong style="color: #dc3545;">The region is missing from the mapping.<br> Please contact someone from the LALP IT DESK</strong>`;
    }

    infoBox.innerHTML = `
        <div class="infoBox-header">
            <strong>${type.charAt(0).toUpperCase() + type.slice(1)} Information:</strong>
        </div>
        <div class="infoBox-content">
            <div class="left-column">
                <div class="no-mention-box">
                    <p><strong>${info}</strong> ${type === 'region' ? 'region' : 'district'} has no mention in the XML file:</p>
                    ${mappingStatusMessage}
                </div>
                ${type.toLowerCase() === 'district' ? `
                <div class="potential-matches-box">
                    <p><strong>Potential Matches:</strong></p>
                </div>
                ` : ''}
            </div>
            <div class="right-column">
                ${additionalMessage}
                <div class="matches-select-box">
                    <div class="dropdown">
                        <button onclick="toggleDropdownInfoBox()" class="dropbtn">Select</button>
                        <div id="myDropdown" class="dropdown-content">
                            <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunctionInfoBox()">
                            ${options}
                        </div>
                    </div>
                </div>
                <div class="xml-generation-box">
                    <p class="XMLGEN">XML_Generation</p>
                </div>
            </div>
        </div>
    `;
    infoBox.style.display = 'block'; // Make sure the box is visible

    // Attach event listeners to the dropdown items
    attachDropdownListeners('myDropdown');
}

function parseXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Extract regions
    const regions = Array.from(xmlDoc.querySelectorAll('listPlace[type="region"] place')).map(place => ({
        id: place.getAttribute('xml:id'),
        name: place.querySelector('placeName').textContent.trim()
    }));

    // Extract countries
    const countries = Array.from(xmlDoc.querySelectorAll('listPlace[type="country"] place')).map(place => ({
        id: place.getAttribute('xml:id'),
        name: place.querySelector('placeName').textContent.trim()
    }));

    return { regions, countries };
}

function toggleDropdownInfoBox() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function showInfoBoxSettlement(settlementInfo) {
    let infoBoxSettlement = document.getElementById('infoBoxSettlement');

    if (!infoBoxSettlement) {
        infoBoxSettlement = document.createElement('div');
        infoBoxSettlement.id = 'infoBoxSettlement';
        infoBoxSettlement.className = 'infoBox';
        document.querySelector('.outputContainer').appendChild(infoBoxSettlement); // Append within outputContainer
    }

    const xmlInput = document.getElementById('XMLInput').value;
    const { regions } = parseXML(xmlInput);

    const additionalMessage = `
        <div class="infoBox-headerB">
            <strong>If there are no matches, then the Settlement needs to be added to the file.<br>
            Please select the corresponding Region</strong>
        </div>`;

    const options = regions.map(region => `<a href="#" class="dropdown-item" data-id="${region.id}">${region.name}</a>`).join('');

    infoBoxSettlement.innerHTML = `
        <div class="infoBox-header">
            <strong>Settlement Information:</strong>
        </div>
        <div class="infoBox-content">
            <div class="left-column">
                <div class="no-mention-box">
                    <p><strong>${settlementInfo.settlement}</strong> has no mention in the XML file.</p><br>
                    <span style="margin-left: 20px"><strong>Corresponding Letter:</strong> ${settlementInfo.correspondingLetter}</span><br><br>
                </div>
                <div class="potential-matches-box">
                    <p><strong>Potential Matches:</strong></p>
                </div>
            </div>
            <div class="right-column">
                ${additionalMessage}
                <div class="matches-select-box">
                    <div class="dropdown">
                    <button onclick="toggleDropdownInfoBoxSettlement()" class="dropbtn">Select</button>
                    <div id="myDropdownSettlement" class="dropdown-content">
                        <input type="text" placeholder="Search.." id="myInputSettlement" onkeyup="filterFunctionInfoBoxSettlement()">
                        ${options}
                    </div>
                    </div>
                </div>
                <div class="xml-generation-box">
                    <p class="XMLGEN">XML_Generation</p>
                </div>
            </div>
        </div>
    `;
    infoBoxSettlement.style.display = 'block'; // Make sure the box is visible

    // Attach event listeners to the dropdown items
    attachDropdownListeners('myDropdownSettlement');
}


function toggleDropdownInfoBox() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunctionInfoBox() {
    const input = document.getElementById("myInput");
    const filter = input.value.toUpperCase();
    const div = document.getElementById("myDropdown");
    const a = div.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
        const txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

// For the dropdown in infoBoxSettlement
function toggleDropdownInfoBoxSettlement() {
    document.getElementById("myDropdownSettlement").classList.toggle("show");
}

function filterFunctionInfoBoxSettlement() {
    const input = document.getElementById("myInputSettlement");
    const filter = input.value.toUpperCase();
    const div = document.getElementById("myDropdownSettlement");
    const a = div.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
        const txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show') && !openDropdown.contains(event.target)) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function attachDropdownListeners(dropdownId) {
    const dropdownLinks = document.querySelectorAll(`#${dropdownId} .dropdown-item`);
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const selectedId = this.getAttribute('data-id');
            const selectedName = this.textContent.trim();

            console.log('Selected ID:', selectedId);
            console.log('Selected Name:', selectedName);

            // Determine which function to call based on the dropdownId
            if (dropdownId === 'myDropdownSettlement') {
                handleDropdownSelectionForInfoBoxSettlement(selectedId, selectedName);
            } else {
                handleDropdownSelectionForInfoBox(selectedId, selectedName);
            }

            // Close the dropdown menu after selection
            const dropdown = document.getElementById(dropdownId);
            dropdown.classList.remove("show");
        });
    });
}

function handleDropdownSelectionForInfoBox(selectedId, selectedName) {
    const infoBox = document.getElementById('infoBox');
    if (infoBox) {
        console.log(`Handling selection for infoBox: ID=${selectedId}, Name=${selectedName}`);

        // Extract the current content of ${info} from the infoBox
        const noMentionBox = infoBox.querySelector('.no-mention-box p');

        if (noMentionBox) {
            const infoContent = noMentionBox.querySelector('strong').textContent;
            selectedName = infoContent;

            // Replace spaces with underscores in the selected name
            const sanitizedSelectedName = selectedName.replace(/ /g, '_');

            // Determine whether it's a region or district based on content
            const type = noMentionBox.innerHTML.includes('region') ? 'region' : 'district';

            // Generate a random ID (5 digits for district, 3 digits for region)
            const randomId = type === 'region' ? Math.floor(100 + Math.random() * 900) : Math.floor(10000 + Math.random() * 90000);

            // Build the XML string with indentation
            let xmlString = '';
            if (type === 'region') {
                xmlString = `&lt;place xml:id="place_${sanitizedSelectedName}_${randomId}"&gt;\n` +
                            `       &lt;placeName&gt;${selectedName}&lt;/placeName&gt;\n` +
                            `       &lt;country ref="plc:${selectedId}"/&gt;\n` +
                            `&lt;/place&gt;`;
            } else {
                xmlString = `&lt;place xml:id="place_${sanitizedSelectedName}_${randomId}"&gt;\n` +
                            `       &lt;placeName&gt;${selectedName}&lt;/placeName&gt;\n` +
                            `       &lt;region ref="plc:${selectedId}"/&gt;\n` +
                            `&lt;/place&gt;`;
            }

            // Update the XML Generation Box with the new XML string
            const xmlGenerationBox = infoBox.querySelector('.xml-generation-box');
            if (xmlGenerationBox) {
                xmlGenerationBox.innerHTML = `<pre><code>${xmlString.trim()}</code></pre>`;
            }
        }
    }
}

function handleDropdownSelectionForInfoBoxSettlement(selectedId, selectedName) {
    const infoBoxSettlement = document.getElementById('infoBoxSettlement');
    if (infoBoxSettlement) {
        console.log(`Handling selection for infoBoxSettlement: ID=${selectedId}, Name=${selectedName}`);

        // Extract the current content of ${info} from the infoBoxSettlement
        const noMentionBox = infoBoxSettlement.querySelector('.no-mention-box p');

        if (noMentionBox) {
            const infoContent = noMentionBox.querySelector('strong').textContent;
            selectedName = infoContent;

            // Replace spaces with underscores in the selected name
            const sanitizedSelectedName = selectedName.replace(/ /g, '_');

            // Generate a random ID (3 digits for regions)
            const randomId = Math.floor(10000 + Math.random() * 90000);

            // Build the XML string with indentation
            const xmlString = `&lt;place xml:id="place_${sanitizedSelectedName}_${randomId}"&gt;\n` +
                              `       &lt;placeName&gt;${selectedName}&lt;/placeName&gt;\n` +
                              `       &lt;region ref="plc:${selectedId}"/&gt;\n` +
                              `&lt;/place&gt;`;

            // Update the XML Generation Box with the new XML string
            const xmlGenerationBox = infoBoxSettlement.querySelector('.xml-generation-box');
            if (xmlGenerationBox) {
                xmlGenerationBox.innerHTML = `<pre><code>${xmlString.trim()}</code></pre>`;
            }
        }
    }
}

function logClickedItem(type, value) {
    console.log(`Clicked ${type.charAt(0).toUpperCase() + type.slice(1)}:`, value);

    // Parse the XML input
    const xmlInput = document.getElementById('XMLInput').value;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, "text/xml");

    // Create a map of region ids to region names
    const regionMap = createRegionMap(xmlDoc);

    // Depending on the type, select the corresponding XML elements to compare against
    let xmlItems;
    if (type === 'district') {
        xmlItems = Array.from(xmlDoc.querySelectorAll('listPlace[type="district"] place'));
    } else if (type === 'region') {
        xmlItems = Array.from(xmlDoc.querySelectorAll('listPlace[type="region"] place'));
    } else {
        // Add other types as necessary
        return;
    }

    // Convert XML elements into an array of objects containing both district and region
    const xmlNames = xmlItems.map(item => {
        const district = item.querySelector('placeName').textContent.trim();
        const regionRef = item.querySelector('region').getAttribute('ref');
        const regionId = regionRef.split('_')[1]; // Extract the correct region ID
        const region = regionMap[regionId] || 'Unknown Region'; // Lookup the region name using the map
        return { district, region };
    });

    // Find the top closest matches (adjust the number of matches to display here)
    const closestMatches = findTopClosestMatches(value, xmlNames, 3); // Displays top 3 matches

    // Display the clicked item and the closest matches in the "Potential Matches" box in the infoBox
    const infoBox = document.getElementById('infoBox');
    if (infoBox) {
        let potentialMatchesBox = infoBox.querySelector('.potential-matches-box');
        potentialMatchesBox.innerHTML = ''; // Clear previous matches

        // Add "Potential Matches:" text with a break line
        const header = document.createElement('p');
        header.innerHTML = '<strong>Potential Matches:</strong><br>';
        potentialMatchesBox.appendChild(header);

        // Append each match to the potential matches box
        closestMatches.forEach(match => {
            const newItem = document.createElement('p');
            newItem.textContent = `${match.district} (Region: ${match.region})`;
            potentialMatchesBox.appendChild(newItem);

            // Log the distance to the console
            console.log(`Match: ${match.district} (Region: ${match.region}), Distance: ${match.distance}`);
        });
    }
}

function logClickedItemSettlement(type, value) {
    console.log("Hello")
    console.log(`Clicked ${type.charAt(0).toUpperCase() + type.slice(1)}:`, value);

    // Parse the XML input
    const xmlInput = document.getElementById('XMLInput').value;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlInput, "text/xml");

    // Create a map of region ids to region names
    const regionMap = createRegionMap(xmlDoc);

    // Depending on the type, select the corresponding XML elements to compare against
    let xmlItems;
    if (type === 'settlement') {
        xmlItems = Array.from(xmlDoc.querySelectorAll('listPlace[type="settlement"] place'));
    } else {
        // Add other types as necessary
        return;
    }

    // Convert XML elements into an array of objects containing both settlement and region
    const xmlNames = xmlItems.map(item => {
        const settlement = item.querySelector('placeName').textContent.trim();
        const regionRef = item.querySelector('region') ? item.querySelector('region').getAttribute('ref') : null;
        const regionId = regionRef ? regionRef.split('_')[1] : null; // Extract the correct region ID
        const region = regionId ? (regionMap[regionId] || 'Unknown Region') : 'No Region'; // Lookup the region name using the map
        return { settlement, region };
    });

    // Find the top closest matches (adjust the number of matches to display here)
    const closestMatches = findTopClosestMatchesSettlement(value, xmlNames, 3); // Displays top 3 matches

    // Display the clicked item and the closest matches in the "Potential Matches" box in the infoBoxSettlement
    const infoBoxSettlement = document.getElementById('infoBoxSettlement');
    if (infoBoxSettlement) {
        let potentialMatchesBox = infoBoxSettlement.querySelector('.potential-matches-box');
        potentialMatchesBox.innerHTML = ''; // Clear previous matches

        // Add "Potential Matches:" text with a break line
        const header = document.createElement('p');
        header.innerHTML = '<strong>Potential Matches:</strong><br>';
        potentialMatchesBox.appendChild(header);

        // Append each match to the potential matches box
        closestMatches.forEach(match => {
            const newItem = document.createElement('p');
            newItem.textContent = `${match.settlement} (Region: ${match.region})`;
            potentialMatchesBox.appendChild(newItem);

            // Log the distance to the console
            console.log(`Match: ${match.settlement} (Region: ${match.region}), Distance: ${match.distance}`);
        });
    }
}


// Function to create a map of region IDs to region names
function createRegionMap(xmlDoc) {
    const regionItems = Array.from(xmlDoc.querySelectorAll('listPlace[type="region"] place'));
    const regionMap = {};
    regionItems.forEach(item => {
        const regionId = item.getAttribute('xml:id').split('_')[1]; // Extract the correct region ID
        const regionName = item.querySelector('placeName').textContent.trim();
        regionMap[regionId] = regionName;
    });
    return regionMap;
}

// Function to calculate Levenshtein distance between two strings
function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Function to find the top closest matches in an array of objects (district and region)
function findTopClosestMatches(input, items, numMatches) {
    // Calculate the Levenshtein distance for each district name
    const distances = items.map(item => ({
        ...item,
        distance: levenshtein(input, item.district)
    }));

    // Sort by the distance (ascending)
    distances.sort((a, b) => a.distance - b.distance);

    // Return the top 'numMatches' closest matches
    return distances.slice(0, numMatches);
}

// Function to find the top closest matches in an array of objects (settlement and region)
function findTopClosestMatchesSettlement(input, items, numMatches) {
    // Calculate the Levenshtein distance for each settlement name
    const distances = items.map(item => ({
        ...item,
        distance: levenshtein(input, item.settlement)
    }));

    // Sort by the distance (ascending)
    distances.sort((a, b) => a.distance - b.distance);

    // Return the top 'numMatches' closest matches
    return distances.slice(0, numMatches);
}