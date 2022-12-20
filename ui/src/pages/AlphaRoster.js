import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Typography } from '@mui/material';

const columns = [
  {field: "id", headerName: "ID", width: 90}
]
const rows = []

const AlphaRoster = () => {

  
  return(
    <div className="AlphaRoster">
      <Container>
        <DataGrid
          columns={columns}
          rows={rows}>


        </DataGrid>

      </Container>
      <p>Alpha Roster</p>

      


    </div>

  )
}

export default AlphaRoster;