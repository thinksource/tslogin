import React, { useState, ChangeEvent } from 'react';
import { Typography, Grid, Select, MenuItem, TextField, FormControlLabel, Switch } from '@material-ui/core';
import { Formik, Form, Field} from 'formik'
import { authenticated } from '../libs/auth';
import { NextPageContext, GetServerSideProps, GetServerSidePropsResult } from 'next';
import { getDatabaseConnection } from '../libs/db';
import { Organization } from '../src/entity/Organization';
import Autocomplete, { AutocompleteChangeReason } from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
// interface Props {
//     email: string
// }

export interface OrganzationProps{
    id: string,
    name: string,
    website: string,
}
export interface PeopleProps {
    names: string[];
}
const PersonForm = async (p : OrganzationProps[])=>{
    const [title, setTitle] = useState<any>("");
    const [clinical_exp, setClinicalExp] = useState<Boolean>(false);
    const [COVID19, setCOVID19] = useState<Boolean>(false);
    const [belongOrg, setbelongOrg] = useState<OrganzationProps>();
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setTitle(event.target.value as string);
      };
    
    const handleClinical = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClinicalExp(event.target.checked)
      };
    
    const handleCOVID19 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCOVID19(event.target.checked)
    }
    
    let message :string =""
    return (
        <>
            <Typography variant="h3">
            Personal information
            </Typography>
            <Formik  onSubmit ={async(_val, _formikHelpers) =>{}}  initialValues={p}>
            <Form>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <TextField
                    id="outlined-multiline-static"
                    label="Summary of AI healthcare expertise"
                    multiline
                    rows={4}
                    placeholder="free text; 350 characters with spaces"
                    
                    variant="outlined"
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <FormControlLabel
                    control={
                      <Switch
                        checked={clinical_exp?true:false}
                        onChange={handleClinical}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label="Clinical expertise"
                    />
                   <FormControlLabel
                    control={
                      <Switch
                        checked={clinical_exp?true:false}
                        onChange={handleCOVID19}
                        name="checkedB"
                        color="secondary"
                      />
                    }
                    label=""
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <Select labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={title}
                    onChange={handleChange}
                    label="Age"
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    </Grid>
                    <br/>
                    <Grid item xs={6}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={p}
                        value ={belongOrg}
                        onChange ={(event: ChangeEvent<{}>, newValue: OrganzationProps|null, _reason: AutocompleteChangeReason)=>{
                            const index=_.findIndex(p, (nv)=>nv.id === newValue?.id)
                            setbelongOrg(p[index])
                        }}
                        getOptionLabel={(option: OrganzationProps) => option.name}
                        style={{ width: 300 }}
                        renderInput={(params:any) => <TextField {...params} label="find Organization" variant="outlined" />}
                        />
                    </Grid>
                </Grid>
            </Form>

            </Formik>
        </>
    )

}

// PersonForm.getInitialProps = async (ctx: NextPageContext) =>{
//     const cookie = ctx.req?.headers.cookie;
//     const res = await fetch('/api/person', {        
//                 headers: {cookie: cookie!}})
//     const json = res.json()
//     return json
// }


export const getServerSideProps: GetServerSideProps<OrganzationProps[]> = async (_ctx) => {
    let resultorg: GetServerSidePropsResult<OrganzationProps[]>  = {props:[]};
    const db = await getDatabaseConnection()
    const result = await db.getRepository(Organization).find({where: {status: "active"}})
    for (let ri of result){
        resultorg.props.push(ri.toSimpleJSON())
    }
    return resultorg
  };
export default PersonForm


