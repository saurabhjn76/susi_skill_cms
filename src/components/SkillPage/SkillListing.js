import React from 'react';
import AceEditor from 'react-ace';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Icon, notification} from 'antd';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/tomorrow';
import 'brace/theme/kuroir';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import 'brace/theme/textmate';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/terminal';
import * as $ from "jquery";
export default class SkillListing extends React.Component {

    state = {
        code :"cako"
    }
    constructor(props) {
        super(props);

        this.state = {
            code:"// code", fontSizeCode:14, editorTheme:"github",test : []
        };

    }

    componentDidMount() {
        // let element = this.props.location.state.element
        let url = this.props.location.state.url;
        let name = this.props.location.state.name;
        name = name.replace(".txt","")
        console.log(url)
        if(url.indexOf("model") < 0) {
            url = this.props.location.state.url + "?skill=" + name;
        }
        else {
            url = this.props.location.state.url + "&skill=" + name;
        }

        url = url.toString()
        url =  url.replace("getSkillList","getSkill");
        console.log(url)
        let self = this;
        $.ajax({
            url: url,
            jsonpCallback: 'pc',
            dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
            success: function (data) {
                self.updateCode(data.text)
            }
        });
        url = this.props.location.state.url;
        url = url.toString()
        url =  url.replace("getSkillList","getDescriptionSkill");
        console.log(url);
        self = this;
        $.ajax({
            url: url,
            jsonpCallback: 'pxcd',
            dataType: 'jsonp',
            jsonp: 'callback',
            crossDomain: true,
            success: function(data) {
                // data = data.examples;
                let keys = Object.keys(data.descriptions);
                if(keys.length===0){
                    notification.open({
                        message: 'Error Processing your Request',
                        description: 'Error in processing the request. Please try with some other skill',
                        icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
                    });
                }
                let test = keys.map((el, i) => {
                    return (<li style={styles.liStyle} key={i}>
                        <Card>
                            <CardHeader
                                title={el.match(/\/([\w]*)\.[\w]{1,5}$/)[1]}
                                subtitle={el}
                                actAsExpander={true}
                                showExpandableButton={true}
                            />

                            <CardText expandable={true}>
                                {data.descriptions[el].map((el, i ) => {
                                    return (<p key={i}>{el}</p>)
                                })}
                            </CardText>
                        </Card>
                    </li>)
                });

                self.setState({
                    test: test
                })

                console.log(self.state.test);

            },
            error: function(e) {
                console.log(e);
                notification.open({
                    message: 'Error Processing your Request',
                    description: 'Error in processing the request. Please try with some other skill',
                    icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
                });
            }

        });
    };

    updateCode = (newCode) => {
        this.setState({
            code: newCode,
        });
        console.log(this.state.code);
    }


    render() {
        return (
            <div style={styles.home}>
            <div>
                <h1>{this.props.location.state.name.replace(".txt","")}</h1>
                <div style={{marginTop:"20px",   marginBottom: "40px",
                    textAlign: "justify",
                    fontSize: "0.1px", width: "100%"}}>

                    <ul id="Grid">
                        {this.state.test}
                    </ul>

                </div>
            </div>
            <div >
                <AceEditor
                    mode="markdown"
                    theme={this.state.editorTheme}
                    width="100%"
                    fontSize={this.state.fontSizeCode}
                    height= "600px"
                    value={this.state.code}
                    name="skill_code_editor"
                    editorProps={{$blockScrolling: true}}
                />

            </div>
            </div>

        );
    }
}

const styles = {
    home: {
        width: '100%'
    }
};
