import { Chart, Series, Size, Legend , ValueAxis, Animation, Border} from 'devextreme-react/chart';

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
            />
            <ValueAxis allowDecimals={false} maxValueMargin={0.1}/>

            <Animation
                easing="easeOutCubic"
                duration={750}
                maxPointCountSupported={1000}
            />

            <Border 
                visible={true}
                color="#000000"
                width={5}
            />
        </Chart>
    );
}

