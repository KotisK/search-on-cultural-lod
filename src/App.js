import React, { Component } from 'react';
// import axios from 'axios';
import logo from './LOGO_SEMANTICS_WHITE.png';
import Inputs from './components/Inputs';
import ResultTable2 from './components/ResultTable2';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'
import ResourceDetails from "./components/pages/ResourceDetails";
// import {d3} from "node_modules/d3-sparql";


import './App.css';
import {MakeHttpReq} from "./components/MakeHttpReq";
// import {CurveLinks} from "./components/CurveLinks";
// import {Curve2} from "./components/Curve2";

class App extends Component {
    state = {
        query: '',
        query_start: 'SELECT distinct * WHERE{ ',
        query_end: ' } limit 250',
        prefixes: 'query= PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX edm: <http://www.europeana.eu/schemas/edm/> PREFIX dc: <http://purl.org/dc/elements/1.1/> PREFIX skos: <http://www.w3.org/2004/02/skos/core#> PREFIX dct: <http://purl.org/dc/terms/> ',
        // artist: '?cho dc:creator ?artist. ?artist skos:prefLabel ?name. ',
        // artist_filter: {
        //     start: 'FILTER regex(?name, "',
        //     value: '',
        //     end: '")'
        // },
        subjects:[],
        filters: [],
        filter : {
            start: ' FILTER regex(',
            subject: '',
            between: ', "',
            value: '',
            end: '") '
        },
        external_services:[],
        http_result: [],
        triples: '',
        showGraph: false,
        clear_inputs: false,
        btn:false,
        input_value:'',
        posted: false
    };

    filter = {
        start: 'FILTER regex(?name, "',
        value: '',
        end: '")'
    };

    // componentDidMount() {
    //     this.clearQuery();
    // }

    // passValue = (input_text) => {
    //     this.setState(prevState => ({
    //         artist_filter: {
    //             ...prevState.artist_filter,
    //             value: input_text
    //         }
    //     }))
    // };

    passValue = (input_text, sub, custom_filter) => {
        // console.log(custom_filter);
        // console.log(input_text);
        if (input_text !== '' &&  input_text !== undefined)
       {
           const filter = (custom_filter !== undefined ) ?
               ( {
                   ...custom_filter,
                   subject: sub,
                   value: input_text
               }) :
               ({
                   // ...this.state.filter,
                   start: ' FILTER regex(',
                   subject: sub,
                   between: ', "',
                   value: input_text,
                   end: '", "i") '
               });
           this.setState(prevState => ({
               filter: filter,
               // filters: this.state.filters.push(filter)
           }));
           this.state.filters.push(filter);
       }
        // console.log(this.state.filter);;
        // console.log(this.state.filters);
    };

    // passService = (input_text) => {
    //
    //   let  artist_federated = {
    //         europeanaStart : ' optional { {SERVICE <http://sparql.europeana.eu> { ?ExternalLink a edm:Agent .  ?ExternalLink skos:prefLabel ?name1. FILTER (lang(?name1) = "en") FILTER regex(?name1, "' ,
    //         input1 : input_text,
    //         eupeana_end: '", "i")}} ',
    //         dbpedia_start: 'union {SERVICE <http://dbpedia.org/sparql/> { ?SameAsLink rdf:type dbo:Person; rdf:type dbo:Artist; rdf:type foaf:Person; foaf:name ?name2.  FILTER (lang(?name1) = "en")  FILTER regex(?name2, "',
    //       input2 : input_text,
    //       dbpedia_end: '", "i")}}}'
    //     } ;
    //
    //     this.state.external_services.push(artist_federated);
    //
    // };

    passSubject = (triple) => {
        // this.setState({
        //     subjects: this.state.subjects.push(triple)
        // });
        this.state.subjects.push(triple);
        this.state.clear_inputs = false;
        // console.log(this.state.subjects);

    };

    builtQuery = (input_text) => {
        let subjects_string = '';
        let filters_string = '';
        let services_string = '';
        this.state.subjects.map((subject)=>
            subjects_string += subject
        );
        console.log(subjects_string);
        this.state.filters.map((filter)=>
           filters_string += Object.values(filter).join('')
        );
        this.state.external_services.map((service)=>
           services_string += Object.values(service).join('')
        );
        console.log(filters_string);
        let tr = [];
        // let triples=[];
        // console.log(temp[0]);
        let temp = subjects_string.replace(/\?/g,'').split('. ').map(triple => {
            tr.push(triple.split(' ') ) ;
        });
        tr.pop();
        // this.state.clear_inputs = true;
        this.setState({
        query: this.state.prefixes + this.state.query_start  + subjects_string + filters_string + services_string + this.state.query_end,
            subjects:[],
            filters: [],
            external_services: [],
            triples: tr,
            // clear_inputs: true
        })

    };

    clearQuery = () =>{
        this.setState({
            query: '',
            subjects:[],
            filters: [],
            external_services: [],
            triples:'',
            btn:false,
            input_value:'',
            clear_inputs: true
        });
    };



    postQuery = () => {
        // let data: {
        //     query: {state.query},
        //     output: {"json"}
        // };

        this.setState({
            clear_inputs: true
        })
        MakeHttpReq('sparql', this.state.query).then((res) =>{
            this.setState({
                http_result: res.data.results.bindings,
                posted: true
            })
        }
        );

    };



    showGraph = () => {
        this.setState({
            showGraph: !this.state.showGraph
        })
    };




    render() {
    return (
        <Router>
            <div className="App">
                <div className="App-header">
                    <Link to={{pathname:'/'}} >
                    <img src={logo} className="App-logo" alt="logo" />
                    </Link>
                    <h2>Search of Semantically Integrated Museum Data </h2>
                </div>
                {/*<h2>Picasso</h2>*/}
                <div className="container-fluid">
                    <div className="row">
                        <div className={'card col-md-6'}>
                            <h2>Artist</h2>
                            <Inputs passValue={this.passValue}
                                // passService={this.passService}
                                    passvalueType={'text'}
                                    passSubject={this.passSubject}
                                    triple={"?artist skos:prefLabel ?name. "}
                                    subject={'?name'}
                                    placeholder={'Name'}
                                    clear={this.state.clear_inputs}
                                       // default_value={this.state.input_value}
                                       // default_btn={this.state.btn}
                            />
                            {/*<h3>Lived Between (Years)</h3>*/}
                            <Inputs passValue={this.passValue}
                                    custom_filter={{
                                           start: ' FILTER(',
                                           subject: '',
                                           between: '>= "',
                                           value: '',
                                           end: '") '
                                       }}
                                    passvalueType={'text'}
                                    passSubject={this.passSubject}
                                    triple={"?artist edm:begin ?born. "}
                                    subject={'?born'}
                                    placeholder={'Born after year'}
                                    clear={this.state.clear_inputs}
                            />
                            <Inputs passValue={this.passValue}
                                    custom_filter={{
                                           start: ' FILTER(',
                                           subject: '',
                                           between: '<= "',
                                           value: '',
                                           end: '") '
                                       }}
                                    passvalueType={'text'}
                                    passSubject={this.passSubject}
                                    triple={"?artist edm:end ?died. "}
                                    subject={'?died'}
                                    placeholder={'Died before year'}
                                    clear={this.state.clear_inputs}
                            />
                            {/*<h3>Nationality</h3>*/}
                            <Inputs passValue={this.passValue}
                                    passvalueType={'text'}
                                    passSubject={this.passSubject}
                                    triple={"?artist skos:note ?Nationality. "}
                                    subject={'?Nationality'}
                                    placeholder={'Nationality'}
                                    clear={this.state.clear_inputs}
                            />
                        </div>
                        <div className={'card col-md-6'}>
                            <h2 className={"card-img-top"}>Artwork</h2>
                            {/*<h3>Title</h3>*/}
                            <Inputs passValue={this.passValue}
                                    passvalueType={'text'}
                                    passSubject={this.passSubject}
                                    triple={"?cho dc:title ?title. ?cho dc:creator ?artist. "}
                                    subject={'?title'}
                                    placeholder={'Title'}
                                    clear={this.state.clear_inputs}
                            />
                            {/*<h3>Medium</h3>*/}
                            <Inputs passValue={this.passValue}
                                    passvalueType={'text'}
                                    passSubject={this.passSubject}
                                    triple={"?cho dct:medium ?medium. "}
                                    subject={'?medium'}
                                    placeholder={'Medium'}
                                    clear={this.state.clear_inputs}
                            />
                            {/*<h3>Date</h3>*/}
                            <Inputs passValue={this.passValue}
                                    custom_filter={{
                                           start: ' FILTER regex(',
                                           subject: '',
                                           between: ', "',
                                           value: '',
                                           end: '") '
                                       }}
                                    passvalueType={'text'}
                                    passSubject={this.passSubject}
                                    triple={"?cho dc:date ?date. "}
                                    subject={'?date'}
                                    placeholder={'Date'}
                                    clear={this.state.clear_inputs}
                            />
                            {/*<h3>Classification</h3>*/}
                            <Inputs passValue={this.passValue}
                                    passvalueType={'text'}
                                    passSubject={this.passSubject}
                                    triple={"?cho dc:type ?classification. "}
                                    subject={'?classification'}
                                    placeholder={'Classification'}
                                    clear={this.state.clear_inputs}
                            />
                            {/*<h3>Thumbnail</h3>*/}
                            {/*<Inputs*/}
                            {/*    passvalueType={'checkbox'}*/}
                            {/*    passSubject={this.passSubject}*/}
                            {/*    triple={"?cho edm:hasView ?thumbnail. "}*/}
                            {/*    subject={'?thumbnail'}*/}
                            {/*/>*/}
                        </div>
                    </div>
                </div>


                {/*<div className="col-md-1">*/}
                    <Link to={{pathname:'/'}} >
                        <button className={'btn btn-success '} onClick={this.builtQuery} style={{width:'100px'}}>Build Query</button>
                    </Link>
                    <button className={'btn btn-danger '} onClick={this.postQuery} style={{width:'100px'}}>Post Query</button>
                    <button className={'btn btn-warning '} onClick={this.clearQuery} style={{width:'100px'}}>Clear Query</button>
                    <button className={'btn btn-info '} onClick={this.showGraph} style={{width:'100px'}} >Show Graph</button>
                {/*</div>*/}
                <textarea value={this.state.query.slice(7, -9)} className={"form-control"} rows={"3"} disabled={'disabled'}/>

                <Route exact path="/" render={props => (
                    <React.Fragment>
                        <ResultTable2 http_result={this.state.http_result} triples={this.state.triples} showGraph={this.state.showGraph} posted={this.state.posted}/>
                    </React.Fragment>
                )}/>
                {/*<Switch>*/}
                    <Route path="/:museum/artist/:id" exact component={ResourceDetails} />
                    <Route path="/:museum/:id/artwork" exact component={ResourceDetails} />
                    <Route path="/:museum/:id" exact component={ResourceDetails} />
                    {/*<Route path="/:museum/:type/:id" exact render={(props) => <ResourceDetails {...props}/>} />*/}
                {/*</Switch>*/}

            </div>
        </Router>

    );
  }
}

export default App;
