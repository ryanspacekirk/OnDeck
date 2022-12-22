import { Chart, Series, Size, Legend, ValueAxis, Animation, CommonAxisSettings } from 'devextreme-react/chart';

// npm i devextreme
// npm i devextreme-react 

export default function BarChart({ data, name, color, width }) {

    return (
        <Chart id="chart" dataSource={data}>
            <Series
                valueField="status"
                argumentField="name"
                name={name}
                type="bar"
                color={color} />
            <Size width={width} />
            <Legend
                position="outside"
                horizontalAlignment="center"
                verticalAlignment="bottom"
                font={{ color: "#e4e6eb" }}
                backgroundColor="#3a3b3c"
            />
            <ValueAxis allowDecimals={false} maxValueMargin={0.1} />
            <CommonAxisSettings
                label={{ font:{ color: "#e4e6eb" }}}
            />

            <Animation
                easing="easeOutCubic"
                duration={750}
                maxPointCountSupported={1000}
            />
        </Chart>
    );
}

