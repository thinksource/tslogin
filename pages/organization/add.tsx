import { Typography, TextField, NativeSelect, Button } from "@material-ui/core"
import { useState, ChangeEvent } from "react";
import { SWRConfig } from "swr";

const OrgzForm = async ()=>{
    const [name, setName] = useState<string>();
    const [brief, seBrief] = useState<string>();
    const [ostatus, setOstatus] = useState<string>();
    const [website, setWebsite] = useState<string>();
    const handleChangeStatus =(e: ChangeEvent<HTMLSelectElement>)=>{
        setOstatus(e.currentTarget.value)
    }
    const handleSubmit=(_e: MouseEvent)=>{
        fetch('')
    }
    return (
        <>
            <Typography variant="h3">Oragnization information</Typography>
            <TextField value={name} label="Oragnization name" variant="outlined"/><br/>
            <TextField value={brief} label="Brief introduction" multiline rows={4} variant="outlined"/><br/>
            Oragnization status: <NativeSelect value={ostatus}
               onChange={handleChangeStatus}>
              <option value="inactive">inactive</option>
              <option value="active">active</option>
           </NativeSelect><br/>
           <TextField value={website} label="Oragnization website" variant="outlined"/><br/>
           <Button color="primary" onClick={handleSubmit}> Submit</Button>
        </>
    )
}
export default OrgzForm