# Contextual Places Tool

## Overview

The Contextual Places Tool is designed to process and filter information from the SNSF-funded project *The Language of the Labouring Poor in Late Modern English* by comparing the letters to an existing XML file that contains contextual information on places. This tool is essential for ensuring data consistency, preventing duplicate entries, and maintaining accurate ID assignments within the XML file. Additionally, it allows users to work efficiently in batches, tracking the progress of the XML file's development.

## How It Works

### Data Extraction

- **User Input:**
  - The tool requires two inputs from the user: the letters from the LALP project and the current state of the `Place.xml` file.

- **Information Filtering:**
  - The tool filters and extracts useful information from the letters and compares it with the existing entries in the XML file.

### Data Cleaning

- **List Generation:**
  - The tool generates a list of all mentions of districts, regions, and settlements found in the letters.

- **Comparison:**
  - This list is then compared with the entries in the `Place.xml` file. The tool identifies any mentions in the letters that do not already exist in the XML file, producing a list of these missing mentions.

### XML Tag Generation

- **Clickable List:**
  - Each item on the list of missing mentions is clickable. When an item is clicked, the tool compares it with existing entries to check for potential matches.

- **Match Handling:**
  - If the user identifies an existing match, no further action is needed.
  - If no match is found, the user can select the corresponding region, and the tool will generate the necessary XML text.

- **XML Structure:**
  - The generated XML tag follows this structure:
    ```xml
    <place xml:id="place_'Name of the place'_'Unique number sequence'">
        <placeName>'Name of the place'</placeName>
        <region ref="plc:'ID of the referenced place.'"/>
    </place>
    ```
  - The user should copy and paste this tag into the appropriate section of the XML file (e.g., settlements under settlements, districts under districts, etc.).

### Manual Adjustments

- **Name Corrections:**
  - The user must ensure the accuracy of the place names and IDs. For example, if a place name like "Sheffords" should actually be "Shefford," the user needs to update both the place name and ID accordingly.

  - Example correction:
    ```xml
    <place xml:id="place_Sheffords_12345">
        <placeName>Sheffords</placeName>
        <region ref="plc:place_Bedfordshire_813"/>
    </place>
    ```
    should be changed to:
    ```xml
    <place xml:id="place_Shefford_12345">
        <placeName>Shefford</placeName>
        <region ref="plc:place_Bedfordshire_813"/>
    </place>
    ```

- **Parenthesis Handling:**
  - The XML file does not accept parenthesis in names. Users should remove any variants with parenthesis from both the place name and ID before finalizing the XML entry.

## Purpose and Application

This tool is meant for ensuring the accurate and consistent documentation of place names within the LALP project. By streamlining the process of identifying and tagging place names, the tool supports the creation of a comprehensive and well-organized XML file.


## Credits

- **Coding:**  
  Nicolas Verdes

- **Icons Used:**  
  - <a href="https://www.flaticon.com/free-icons/dark-mode" title="dark mode icons">Dark mode icons created by Freepik - Flaticon</a>  
  - <a href="https://www.flaticon.com/free-icons/globe" title="globe icons">Globe icons created by Freepik - Flaticon</a>  
  - <a href="https://www.flaticon.com/free-icons/collapse" title="collapse icons">Collapse icons created by Ayub Irawan - Flaticon</a>  
  - <a href="https://www.flaticon.com/free-icons/resize" title="resize icons">Resize icons created by Fingerprint Designs - Flaticon</a>