import ListHistoryChange from './ListHistoryChange';

const ListHistoryEntry = ({ historyEntry }) => {

    return (
        <div>
            {historyEntry.changes.map((change, index) => (<ListHistoryChange key={index} change={change} />))}
        </div >
    )
}

export default ListHistoryEntry