# MOLGENIS biobank plots
This app plots aggregate sample information for Biobanks. 
You can specify filters and charts which show you which Biobanks have samples according to the set filters.

When you want to start the demo-application please clone this repository to your own workstation.

Prerequisites are:
- git
- npm
- yarn
 
To start de demo please type on the application root:

```
yarn install
yarn dev
```

Access the application on localhost and the port on which the application is served (default is: [http://localhost:8080](http://localhost:8080)) and you will get a demo-page with fake data.
 
**Note:** the demo page does not respond to filter interaction. When you want dynamic interaction with filters you will need to connect to a MOLGENIS-backend. 

## Configuration
This app has a generic scheme which serves the data for the charts and filters. Besides this there is also an exmaple that is described how to map the implementation of the data to the generic schemes.
 
### Filters  
To setup the filters you have to conform to the following scheme. For each filter this scheme has to be filled.
  
The different filter types are:
- [Dropdown](#Dropdown)
- [Range](#Range)
- [Checkbox-row](#Checkbox-row)
- [Checkbox-list](#Checkbox-list)

#### Dropdown
     
```javascript
{
  id: string,
  label: string,
  filterType: 'dropdown',
  options: [
    { 
      id: string,
      label: string,
      value: string
    }
  ]  
}
```

#### Range

```javascript
{ 
  id: string,
  label: string,
  filterType: 'range',
  options: [minNUmber, maxNumber]
}
```

#### Checkbox-row   

```javascript
{
  id: string,
  label: string,
  filterType: 'checkbox-row',
  options: [
    {
      id: string,
      label: string, 
      value: string
    }
  ]
}
```    

#### Checkbox-list      
 
```javascript   
{
  id: attribute.name,
  label: attribute.label,
  filterType: 'checkbox-list',
  options: options.sort(
    (optionA, optionB) => {
      return optionA.id < optionB.id ? -1 : optionA.id > optionB.id ? 1 : 0
    }
  )
}
```  

### Charts
There are several charts that can be defined upon the data.
- [HorizontalBarChart](#HorizontalBarChart)
- [ColumnChart](#ColumnChart)
- [VerticalBarChart](#VerticalBarChart)
- [MultiColumnChart](#MultiColumnChart)

#### HorizontalBarChart

```javascript
{
  name: string,
  title: string,
  type: ChartType,
  inline: boolean
}
```

#### ColumnChart

```javascript
{  
  name: string,
  title: string,
  type: ChartType,
  inline: boolean,
  datasets: [
    {label: string, backgroundColor: string},
    {label: string, backgroundColor: string},
    {label: string, backgroundColor: string}
  ]
}    
```    
   
#### VerticalBarChart

```javascript
{
  name: string,
  title: string,
  type: ChartType,
  inline: false
}
```

#### MultiColumnChart
Use MultiColumnChart for COMPOUND types 

```javascript
{
  name: string,
  title: string,
  inline: boolean,
  columns: [
    {
      id: string,
      label: string
    },  
  ],
  type: 'MultiColumnChart', 
  datasets: [
    {
      label: string,
      backgroundColor: string
    }
  ]
```

## Implementation
The data model required for these plots should consist of aggregateable attributes. 

An example attributes sheet:  

| id  | abbr        | description                                             |
|-----|-------------|---------------------------------------------------------|
| 1   | LIFELINES   | LifeLines enables research on healthy aging             | 
| 2   | PROSPER     | Prospective Study of Pravastatin in the Elderly at Risk |
| 3   | NESDA       | Netherlands Study of Depression and Anxiety             |

| id  | data_type                  | filters         | biobank   | genotypes    | transcriptome  | metabolome | age | sex | smoking | wbcc | wgs | methylome | age_years | 
|-----|----------------------------|-----------------|-----------|--------------|----------------|------------|-----|-----|---------|------|-----|-----------|-----------| 
| 1   | genotypes,metabolome,wbcc  | age,sex,smoking | LIFELINES | 1            | 4              | 5          | 12  | M   | true    | 1    | 1   | 6         | 12        |
| 1   | genotypes,metabolome,wbcc  | age,sex,smoking | LIFELINES | 1            | 4              | 5          | 12  | M   | true    | 1    | 1   | 6         | 12        | 

Download the complete model [here](./docs/data/example-model.xlsx) 
   
## Runtime configuration
When you want to configure this app there are multiple runtime configuration parameters to be set.

**Mandatory**
- Server: 
  server url
- Samples table:
  Specifies the entity that is requested on the running MOLGENIS instance
- attributes: charttypes descirption (see [Charts](#Charts))

**Optional**
- Color scheme:
  The following colors can be defined
  - primaryColor
  - secondaryColor
  - tertiaryColor
  - backgroundColor

### Example configuration
You can add a runtime configuration by inlining this code snippet in your index.html.

```js
  <script>
      var server = 'https://yourfancyserverhere'
      var primaryColor = '#184B8A'
      var secondaryColor = '#ed660c'
      var tertiaryColor = '#cccccc'
      var backgroundColor = '#e6e9ef'

      window.__INITIAL_STATE__ = {
        server: server,
        sampleTable: 'project_samples',
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        tertiaryColor: tertiaryColor,
        backgroundColor: backgroundColor,
        attributes: [
          {
            name: 'biobank',
            title: 'Number of samples per biobank',
            type: 'HorizontalBarChart',
            inline: false
          },
          {
            name: 'wbcc',
            title: 'Whole bloodcell counts',
            type: 'ColumnChart',
            inline: true,
            datasets: [
              {label: 'Yes', backgroundColor: primaryColor},
              {label: 'No', backgroundColor: secondaryColor},
              {label: 'Not available ', backgroundColor: tertiaryColor}
            ]
          },
          {
            name: 'age_years',
            title: 'Age in years',
            type: 'VerticalBarChart',
            inline: false
          },
          {
            name: 'data_type',
            title: 'Data available',
            inline: false,
            columns: [
              {id: 'genotypes', label: 'Genotypes'},
              {id: 'metabolome', label: 'Metabolome'},
              {id: 'methylome', label: 'Methylome'},
              {id: 'transcriptome', label: 'Transcriptome'},
              {id: 'wgs', label: 'Whole genome sequence'}
            ],
            type: 'MultiColumnChart', <!-- Use MultiColumnChart for COMPOUND types -->
            datasets: [
              {label: 'Available', backgroundColor: primaryColor},
              {label: 'Unavailable', backgroundColor: secondaryColor}
            ]
          },
          {
            name: 'smoking',
            inline: true,
            title: 'Ever smoked',
            type: 'ColumnChart',
            datasets: [
              {label: 'Yes', backgroundColor: primaryColor},
              {label: 'No', backgroundColor: secondaryColor},
              {label: 'Not available ', backgroundColor: tertiaryColor}
            ]
          },
          {
            name: 'sex',
            title: 'Sex',
            inline: true,
            type: 'ColumnChart',
            datasets: [
              {label: 'Male', backgroundColor: primaryColor},
              {label: 'Female', backgroundColor: secondaryColor},
              {label: 'Not available ', backgroundColor: tertiaryColor}
            ]
          }
        ]
      }
    </script>
```

## Developing Biobank Plots
When you want to develop the Biobank plots you must be aware that this is an MOLGENIS app. See 

### Build Setup

```bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn dev

# Build for production with minification
# The created artifacts can be uploaded to the MOLGENIS app store.
# After zipping it into an archive
yarn build

# run unit tests
yarn unit

# run all tests
yarn test
```

### Include app in MOLGENIS

You can create a MOLGENIS app by following this manual: [MOLGENIS app developement](https://molgenis.gitbooks.io/molgenis/content/developer_documentation/app-development.html)
