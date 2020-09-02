import { Typography, TextField, NativeSelect, Button} from "@material-ui/core"
import { useState, ChangeEvent } from "react";
import { SWRConfig } from "swr";
import Alert from '@material-ui/lab/Alert';

const OrgzForm = async ()=>{
    const [name, setName] = useState<string>();
    const [brief, seBrief] = useState<string>();
    const [ostatus, setOstatus] = useState<string>();
    const [website, setWebsite] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [error, setError] = useState< "info" | "success" | "warning" | "error" >('info');
    const handleChangeStatus =(e: ChangeEvent<HTMLSelectElement>)=>{
        setOstatus(e.currentTarget.value)
    }
    const handleSubmit=()=>{
        const val = {name, brief, ostatus, website}
        fetch('/api/organization/update', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(val)
      }).then(async (res)=>{
        if (res.ok){
            setError("success")
            setMessage("update successfull")
        }else{
            setError("error")
            const myjson = await res.json()
            setMessage(myjson.message)
        }
      })
    }
    return (
        <>
            <Typography variant="h3">Oragnization information</Typography>
            <Alert severity={error}>{message}</Alert>
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