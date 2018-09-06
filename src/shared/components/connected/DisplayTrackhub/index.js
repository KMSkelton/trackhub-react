import axios from "axios"
import hocPageLoader from "connected/hocPageLoader"
import React from "react"
import styles from "./display-trackhub.scss"

class DisplayTrackhub extends React.Component {

 // optional external data needs
 // static loadData(storeDispatch, params) {
 //  return storeDispatch(loadPageData(`https://jsonplaceholder.typicode.com/posts`))
 // }

 // optional custom data check
 // static checkData(props) {
 //  const {
 //   page: {
 //    slug: pageSlug
 //   }
 //  } = props

 //  return pageSlug === "homepage"
 // }

  constructor(props) {
    super(props)
    this.state = {
      'browserId': 'svgHolder'
    }
  }

  componentDidMount() {
    this.configureBrowser();
  }

  configureBrowser = () => {
    var sources = [
      {
          name: 'Genome',
          twoBitURI: '//www.biodalliance.org/datasets/hg38.2bit',
          tier_type: 'sequence'
      },
      {
          name: 'GENCODE',
          desc: 'Gene structures from GENCODE 20',
          bwgURI: '//www.biodalliance.org/datasets/GRCh38/gencode.v20.annotation.bb',
          stylesheet_uri: '//www.biodalliance.org/stylesheets/gencode2.xml',
          collapseSuperGroups: true,
          trixURI: '//www.biodalliance.org/datasets/GRCh38/gencode.v20.annotation.ix'
      },
      {
          name: 'SNPs',
          tier_type: 'ensembl',
          species: 'human',
          type: 'variation',
          disabled: true,
          featureInfoPlugin: function (f, info) {
              if (f.id) {
                  info.add('SNP', makeElement('a', f.id, { href: '//www.ensembl.org/Homo_sapiens/Variation/Summary?v=' + f.id, target: '_newtab' }));
              }
          }
      }
    ];
     this.createBrowser(sources);
  }

  createBrowser = (sources) => {

    var b = new Browser({
        chr: 'chr1',
        viewStart: 66490870,
        viewEnd: 66790811,
        noPersist: true,
        noPersistView: true,
        pageName: this.state.browserId,
        cookieKey: 'human-grc_h38-' + this.state.browserId,
        coordSystem: {
            speciesName: 'Human',
            taxon: 9606,
            auth: 'GRCh',
            version: '38',
            ucscName: 'hg38'
        },
        chains: {
            hg19ToHg38: new Chainset('//www.derkholm.net:8080/das/hg19ToHg38/', 'GRCh37', 'GRCh38',
                {
                    speciesName: 'Human',
                    taxon: 9606,
                    auth: 'GRCh',
                    version: 37,
                    ucscName: 'hg19'
                })
        },
        hubs: [
          'https://s3-us-west-2.amazonaws.com/dm-trackhubs/MCD34/MCD34.hub.txt'
        ],
        sources: sources,
        ...this.state.disableOpts
    });
  }

 render() {
  return (
   <div className={styles.homepage}>
    <h1>Trackhub</h1>
    <div id={this.state.browserId} key={this.props.viewRegion}>
                Loading dalliance...
            </div>
   </div>
  )
 }
}

export default hocPageLoader(DisplayTrackhub)
