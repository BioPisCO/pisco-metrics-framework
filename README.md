# PisCO: A Performance Indicators Framework for COllection of Bioinformatics Resource Metrics

PIsco is a Node.js server-side JavaScript framework for the collection, registration and sharing of metrics used to evaluate the impact of bioinformatics-related resources such as software, training or databases. The metrics framework can be used to capture standard definitions of metrics, facilitate the collection of data, monitor resources and share data to be reused by other teams, laboratories or academic institutions.

## PIsCO structure

This framework consists of 3 different elements that work together:

1. **Component**. Defines the metric standard definition (common metadata into  XML schema), and metric functionality (following a basic structure: code, documentation, guidelines, and examples, stored into the source code manager).
2. **Components Registry**. Registers the component metadata into a registry to make them available for use. The component metadata will be used to install this component into the framework repository.
3. **Data and Monitoring Repository**. Installs, executes components and collects data from the component execution.  Metrics results, generated from each component execution are stored in a Mongodb database and they are able to be used and interpreted.

## Git

`git clone https://github.com/BioPisCO/pisco-metrics-framework.git`

## Requirements

1. Nodejs
2. npm
3. MongoDB

## Install library dependencies

`nmp install`

## Documentation

## Documentation

1. [User Manual] (https://drive.google.com/file/d/0B3RWb8BCtZH1alA5Q0tRNDU0QUk/view?usp=sharing)
2. [SPECIFICATION document] (https://drive.google.com/file/d/0B3RWb8BCtZH1Uk1qbDJkN3ZoWEU/view?usp=sharing)
3. [METRICS specification document] (https://drive.google.com/file/d/0B3RWb8BCtZH1dTR2SlFORGdieXc/view?usp=sharing)
4. METRICS examples:
 * [Citation] (https://github.com/BioPisCO/metrics-module-citation) 
 * [Page Views] (https://github.com/BioPisCO/metrics-module-pageviews)
 * [Social Media] (https://github.com/BioPisCO/metrics-module-tweets)


