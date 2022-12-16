
import PieChart, { Series, Label, Connector, Size, Legend } from 'devextreme-react/pie-chart';

// npm i devextreme
// npm i devextreme-react 

export default function PieChart2({ data }) {

    function pointClickHandler(e) {
        toggleVisibility(e.target);
    }

    function legendClickHandler(e) {
        const arg = e.target;
        const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];
        toggleVisibility(item);
    }

    function toggleVisibility(item) {
        item.isVisible() ? item.hide() : item.show();
    }

    return (
        <PieChart
            id="pie"
            dataSource={data}
            palette="Bright"
            title="Shift overview"
            onPointClick={pointClickHandler}
            onLegendClick={legendClickHandler}
        >
            <Series
                argumentField="type"
                valueField="area"
            >
                <Label visible={true}>
                    <Connector visible={true} width={1} />
                </Label>
            </Series>

            <Size width={1000} height={500}/>
            <Legend
                horizontalAlignment="right"
                verticalAlignment="top"
            />
        </PieChart>
    );
}