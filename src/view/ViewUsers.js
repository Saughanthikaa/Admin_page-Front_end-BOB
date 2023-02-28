import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useNavigate, } from "react-router-dom";
import ViewPosts from './ViewPosts';
import { Progress } from "../../src/components/Progress"
import { Toast } from 'primereact/toast';
import React from 'react';
function ViewUsers() {
    const [data, setData] = useState([]);
    const [progressspinner, setProgressSpinner] = useState(false)
    const toast = useRef();
    const [selectedData, setSelectedData] = useState(null);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [userPost, setUserPost] = useState();
    const [formData, setFormData] = useState({
        id:'',
        userId: '',
        name: '',
        avatar: '',
        createdAt: '',
        
      });
    
    const iconStyles = {
        height: '30px',
        width: '30px',
        marginRight: '5px'
    };
    let navigate = useNavigate();
    useEffect(() => {
        setProgressSpinner(true)
        getUsers();

    }, []);
    function getUsers() {
        fetch('https://637de434cfdbfd9a63a00317.mockapi.io/test/v2/users')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setProgressSpinner(false);
            }).catch(error => console.log(error));
    }
    const onAdd = () => {
        setVisibleDialog(true);
        setFormData({ 
            id:'',
        userId: '',
        name: '',
        avatar: '',
        createdAt: '',
       });
    };

    function handleCancelClick(rowData){
        //console.log("post",post);
        fetch(`https://637de434cfdbfd9a63a00317.mockapi.io/test/v2/users/${rowData.id}`, {
            method: 'DELETE',
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to delete data');
              }
              // Update your data here after successful delete
            })
            .catch(error => {
              console.error(error);
              // Handle error here
            });
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'User Deleted successfully!' });
        setData(data.filter(item => item.id !== rowData.id));

    }
    const onEdit = (rowData) => {
        setSelectedData(rowData);
        setFormData({ ...rowData });
        setVisibleDialog(true);
        console.log("edit data", rowData)

        
        setData(data.filter(item => item.id !== rowData.id));
    };
    const onViewPosts = (state) => {
        navigate("/viewPosts", { state });

    }
    const onDelete = (rowData) => {
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'User Deleted successfully!' });
        setData(data.filter(item => item.id !== rowData.id));
    };


        const onSave = async (event) => {
            if (formData.id === null) {
            setData([...data, formData]);
        } else {
            setData(data.map(item => (item.id === formData.id ? formData : item)));
        }
        event.preventDefault();
            try {
            const response = await fetch('https://637de434cfdbfd9a63a00317.mockapi.io/test/v2/users', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log('Response:', data);
            } catch (error) {
            console.error('Error:', error);
            }
            window.location.reload();
            toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Action Successfull!' });
            setVisibleDialog(false);
    };

    const renderFooter = () => {
        return (
            <div>
                <Button label="Save" icon="pi pi-check" onClick={onSave} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => setVisibleDialog(false)} className="p-button-secondary" />
            </div>
        );
    };

    const dialog = (
        <Dialog header={selectedData ? 'Edit User' : 'Add User'} visible={visibleDialog} style={{ width: '400px' }} footer={renderFooter()} onHide={() => setVisibleDialog(false)}>
            <div className="p-fluid">
                <div className="p-field">
                    
                    <label htmlFor="name">User Name</label>
                    <InputText id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <label htmlFor="Avatar">Avatar</label>
                    <InputText id="Avatar" value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} />
                    <label htmlFor="createdAt">Created at</label> 
                    <InputText id="createdAt" value={formData.createdAt} onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })} />
                    
                    
                    
                </div>
            </div>
        </Dialog>
    );

    const actionButtons = (rowData) => {
        return (
            <div>
                <Button icon="pi pi-book" style={iconStyles} onClick={() => onViewPosts(rowData)} className="p-button-rounded p-button-warning " />
                <Button icon="pi pi-pencil" style={iconStyles} onClick={() => onEdit(rowData)} className="p-button-rounded p-button-success " />
                <Button icon="pi pi-trash" style={iconStyles} onClick={()=>handleCancelClick(rowData)} className="p-button-rounded p-button-danger" />
            </div>
        );
    };

    return (
        <div style={{ justifyContent: 'center' }}>
            <Toast ref={toast} />
            <Progress value={progressspinner} />
            <div class="card">
                <div class="card-container yellow-container">
                    <div class="block font-bold text-right p-4 border-round mb-3">

                        <Button label="Add User" icon="pi pi-plus" className="p-mb-3" onClick={onAdd} />
                    </div>
                    <div style={{ textAlign: 'center', padding: '90px', height: 'calc(100vh - 145px)' }}>
                        <DataTable header="Users List" value={data} size="small" selectionMode="single" stripedRows selection={selectedData} scrollable scrollHeight="flex" rows={10} rowsPerPageOptions={[5, 10, 25]} onSelectionChange={(e) => setSelectedData(e.value)}>
                            <Column field="id" header="ID"></Column>
                            <Column field="name" header="Name"></Column>
                            <Column field="recent_posts.length" header="Number of Posts"></Column>
                            <Column body={actionButtons} headerStyle={{ width: '10rem' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }}></Column>
                        </DataTable>
                    </div>

                </div>
            </div>
            {dialog}
        </div>
    );
}

export default ViewUsers;
