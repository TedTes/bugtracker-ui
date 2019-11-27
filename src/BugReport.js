import React from 'react';
import {Panel,Table} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch';
import BugFilter from './BugFilter';
import withToast from './withToast';

const statuses=['Closed','Assigned','New','Fixed'];

class BugReport extends React.Component
{
    static async fetchData(match,search,showError)
    {
        const params = new URLSearchParams(search);
const vars = { };
if (params.get('status')) vars.status = params.get('status');
const effortMin = parseInt(params.get('effortMin'), 10);
if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
const effortMax = parseInt(params.get('effortMax'), 10);
if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;
const query = `query bugList(
$status: StatusType
$effortMin: Int
$effortMax: Int
) {
bugCounts(
status: $status
effortMin: $effortMin
effortMax: $effortMax
) {
owner New Assigned Fixed Closed
}
}`;
const data = await graphQLFetch(query, vars, showError);
return data;
}
    constructor(props) {
        super(props);
        const stats =  null;
      //  delete store.initialData;
        this.state = { stats };
        }
        componentDidMount() {
        const { stats } = this.state;
        if (stats == null) this.loadData();
        }
        componentDidUpdate(prevProps) {
        const { location: { search: prevSearch } } = prevProps;
        const { location: { search } } = this.props;
        if (prevSearch !== search) {
        this.loadData();
        }
        }
        async loadData() {
            const { location: { search }, match, showError } = this.props;
            const data = await BugReport.fetchData(match, search, showError);
            if (data) {
            this.setState({ stats: data.bugCounts });
            }
            }
            render() {
            const { stats } = this.state;
            if (stats == null) return null;
            const headerColumns = (
            statuses.map(status => (
            <th key={status}>{status}</th>
            ))
            );
            const statRows = stats.map(counts => (
                <tr key={counts.owner}>
                <td>{counts.owner}</td>
                {statuses.map(status => (
                <td key={status}>{counts[status]}</td>
                ))}
                </tr>
                ));
                return (
                    <>
                    <Panel>
                    <Panel.Heading>
                    <Panel.Title toggle>Filter</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body collapsible>
<BugFilter urlBase="/report" />
</Panel.Body>
</Panel>
<Table bordered condensed hover responsive>
<thead>
<tr>
<th />
{headerColumns}
</tr>
</thead>
<tbody>
{statRows}
</tbody>
</Table>
</>
);
}
}
export default withToast(BugReport);