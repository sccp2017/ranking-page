import * as React from "react";
import * as ReactDOM from "react-dom";
import { List, Range, Map } from "immutable";
import { IRanking } from "../define";
import axios from "axios";


interface IAppState {
    ranking: List<IRanking>;
}

export default class App extends React.Component<{}, IAppState> {
    constructor(props) {
        super(props);
        this.state = { ranking: List<IRanking>() };
    }

    private rankList2Map(ranking: List<IRanking>): Map<string, number> {
        return ranking.reduce((acc, r) =>
            acc.set(r.id, r.prs)
            , Map<string, number>());
    }

    componentDidMount() {
        const statusLoop = (i = 1) => {
            const request = axios.get(`https://api.github.com/repos/sccp2017/defective-project/pulls?state=closed&per_page=100&page=${i}`);
            request.then((res) => {
                console.log(i, res.data, res.data.size);
                if (res.data.length !== 0) {
                    const tmpPRs = (res.data as Array<any>).reduce((acc, p) => {
                        const user: string = p.user.login;
                        const regex = /s12(4|5).+/;
                        return regex.test(user) ?
                            acc.update(user, (i) => i === undefined ? 1 : i + 1) :
                            acc;
                    }, this.rankList2Map(this.state.ranking));

                    const prs = tmpPRs.sort((a, b) => {
                        if (a < b) {
                            return 1;
                        } else if (a > b) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }).map((p, i) => ({ id: i, prs: p })).toList();

                    const ranking = prs.map((p, i) => ({ ...p, place: i })).toList();
                    this.setState({ ranking });
                    statusLoop(i + 1);
                }
            });
        };

        statusLoop();
    }

    render() {
        const rankHeader = <li>
            <ul className="rank-element">
                <li><b>Place</b></li>
                <li className="left-element"><b>ID</b></li>
                <li><b>PRs</b></li>
            </ul>
        </li>;
        const ranking = this.state.ranking.map((r, i) =>
            <li key={r.id}>
                <ul className="rank-element">
                    <li>{i + 1}</li>
                    <li>{r.id}</li>
                    <li>{r.prs}</li>
                </ul>
            </li>
        );

        return <div>
            <h1 className="title" > SCCP2017 Contribution Ranking</h1 >
            <h2 className="subtitle">Who is the best contributor in SCCP2017?</h2>
            <ul className="ranking">
                {rankHeader}
                {ranking}
            </ul>
        </div >;
    }
}