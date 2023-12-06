import React, { useState } from 'react'
import classes from './xp.module.css'
import FlexBox from '../../cv_components/flexbox/FlexBox'
import LabelInput from '../form_components/LabelInput'
import LabelDate from '../form_components/LabelDate'
import { useDispatch, useSelector } from 'react-redux'
import { bioActions } from '../../store/store'
import ExistingData from '../existing_data/ExistingData'


function Xp(props) {
    const xpFromStore = useSelector(state=>state.bioData.data.xp)
    const dispatch = useDispatch()
    const [ currentWork, setCurrentWork ] = useState(false)
    // const [ review, setReview ] = useState(false)
    const [ addMore, setAddMore ] = useState(true);
    const initialValue = {name: '', role: '', start_date: '', end_date: ''}
    const [ value, setValue ] = useState(initialValue)
    const [ editableValue, setEditableValue ] = useState(initialValue)
    const [ validity, setValidity ] = useState(false)
    
    function valueChangeHandler(e){
        // console.log('changed', e.target.value)
        setValue(prev=>{return{...prev, [e.target.name]: e.target.value}})
        setValidity(Object.values(value).every(Boolean))
        // console.log(value)
        if( value.name && value.role ) setValue(prev=>{
            const newId = `${prev.name.slice(0, 5)}${prev.role.slice(0, 4)}`; 
            return { ...prev, id: newId};
        })
    }
    function change(e){
        setCurrentWork((prev)=>!prev)
        currentWork && setValue(prev=>{return{...prev, [e.target.name]: 'Present'}})
    }
    function submitHandler(e){
        e.preventDefault();
        if(!Object.values(editableValue).every(Boolean)) dispatch(bioActions.updateBioData({ xp: value }))
        else{
            const existing = xpFromStore.findIndex(item=>item.id === editableValue.id)
            console.log(existing, editableValue)
            const dupe = [...xpFromStore]
            dupe.splice(existing, 1, value)
            dispatch(bioActions.replaceBioData({xp: dupe}))
            setEditableValue(initialValue) 
        }
        setCurrentWork(false)
        setAddMore(false)
        setValue(initialValue)
        setValidity(false)
    }
    function addItemHandler(){
        setAddMore(true)
    }
    function existingItemHandler(e, id){
        const existing = xpFromStore.findIndex(item=>item.id === id)
        const dupe = [...xpFromStore]   
        if(existing !== -1){
            if(e.target.id === 'delete') dupe.splice(existing, 1)
            else if(e.target.id === 'edit'){
                const editable = dupe[existing]
                const {name, role,  start_date, end_date, id} = editable
                setEditableValue({name, role,  start_date, end_date, id})
                setValue(editable)
                setAddMore(true)
            }
            dispatch(bioActions.replaceBioData({ xp: dupe }))
        }
    }
  return (
    <div className='formSectionContainer'>
        <div className='heading'>
            Experience section
        </div>
        {xpFromStore.length > 0 && <ExistingData onAddMore = {addItemHandler} target='xp' onClick={existingItemHandler}/>}
        {( addMore || !xpFromStore.length > 0 ) && <FlexBox style={{alignItems: 'start'}}>
            <FlexBox direction = 'row' width = '100'>
                <LabelInput id='Name of the Company' placeholder='Company' labelName='Name of the Company'  onChange={valueChangeHandler} name='name' value={value.name}/>
            </FlexBox>
            <FlexBox direction = 'row' width = '100'>
                <LabelInput id='Job role' placeholder='Job role' labelName='Job role' onChange={valueChangeHandler} name='role' value={value.role}/>
            </FlexBox>
            <FlexBox direction='row' width = '100'>
                <LabelDate id='startDate' labelName='Start date' onChange={valueChangeHandler} name='start_date' value={value.start_date}/>
                <LabelDate id='endDate' labelName='End date' disabled={currentWork} onChange={valueChangeHandler} name='end_date' value={value.end_date}/>
            </FlexBox>
            <FlexBox direction='row' style={{'marginLeft': '1rem'}}>
                <input type='checkbox' id='currentWork' onChange={change} name='end_date'/>
                <label htmlFor="currentWork" style={{'marginLeft': '1rem'}}>Currently working</label>
            </FlexBox>
            <FlexBox width='100' style={{'alignItems': 'start'}}>
                <label htmlFor="accomplishments" style={{'textAlign': 'left', margin: '8px 0px', 'fontSize': '1.05rem'}}>Accomplishments / Achievements (optional)</label>
                <textarea name="accomplishments" id="accomplishments" placeholder='Hit Enter for new bullet point' onChange={valueChangeHandler} value={value.accomplishments && value.accomplishments} className='textArea'></textarea>
            </FlexBox>
        </FlexBox>}
        <FlexBox direction='row'>
            <button onClick={submitHandler} disabled={!validity}>Save</button>
        </FlexBox>
        <center className='nextContainer'>
            <button onClick={()=>dispatch(bioActions.updateCurrentPage({direction: '-1'}))}>Back</button>
            <button onClick={()=>dispatch(bioActions.updateCurrentPage({direction: '1'}))}>Next section</button>
        </center>
    </div>
  )
}

export default Xp