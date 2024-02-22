import { ColDef } from 'ag-grid-community';
import { format, fromUnixTime } from 'date-fns';
import esLocale from 'date-fns/locale/es';

export interface IActivityLog {
    actualKey?: string;
    code?: string;
    created?: string;
    description?: string;
    driver?: string;
    event?: string;
    format?: string;
    icon?: string;
    location?: string;
    program?: string;
    round?: string;
    route?: string;
    studentId?: string;
    studentName?: string;
    type?: string;
    updateData?: boolean;
    valid?: boolean;
    validUsage?: boolean;
    vehicle?: string;
    customerName?: string;
    time?: string;
    routeName?:string;
    routeid?:string;
    vehicleName?:string;
    driverName?:string;
    customerId?:string;
    id?:string;
  }

  export var ColumnDefs = [
    { headerName: 'Fecha', field: 'created', cellRenderer: (params) => { 
      if (params && params.value) {
        return format( fromUnixTime(params.value.seconds), 'MM/dd/yyyy HH:mm', { locale: esLocale })
      }
    }},
    // { headerName: 'Fecha', field: 'created' },
    { headerName: 'Alumno', field: 'studentName', sortable: true },
    { headerName: 'Matrícula', field: 'studentId', sortable: true, enableValue: true, allowedAggFuncs: ['count'] },
    { headerName: 'Ingreso con', field: 'studentId', sortable: true, enableValue: true, allowedAggFuncs: ['count'] },
    { headerName: 'Evento', field: 'event', sortable: true, enableRowGroup: true },
    { headerName: 'Tipo', field: 'type', sortable: true, enableRowGroup: true },
    { headerName: 'Descripción', field: 'description', sortable: true },
    { headerName: 'Ruta', field: 'route', enableRowGroup: true },
    { headerName: 'Turno', field: 'round', enableRowGroup: true },
    { headerName: 'Programa', field: 'program', enableRowGroup: true },
    { headerName: 'Vehículo', field: 'vehicle', enableRowGroup: true },
    { headerName: '¿Subió?', field: 'allowedOnBoard', enableRowGroup: true }
  ];
 export var LiveProgramColumnsDef =[
  { headerName: '--',width:90, cellStyle: {color: 'blue'}, field: 'editMode',pinned: 'left', enableCellChangeFlash:true 
  ,valueGetter: (params) => {
    if(params && params.node) {     
      return  "Editar"
    } }},
  { headerName: 'Inicia', width:115, field: 'time', 
    valueGetter: (params) => {
      if(params && params.node && params.node.data.time) {
        return format( fromUnixTime(params.node.data.time.seconds), 'HH:mm a', { locale: esLocale })
      }
  } },
  { headerName: 'Cliente',width:170, field: 'customerName',filter: true, sortable: true, enableCellChangeFlash:true },
  { headerName: 'Ruta', width:130,field: 'routeName', filter: true, sortable: true, enableCellChangeFlash:true },
  { headerName: 'Programa / Turno',width:175, field: 'round', valueGetter: (params) => {
    if(params && params.node) {     
      return  params.node.data.round + " / " + params.node.data.program
    }
  }},
  { headerName: 'Conductor', width:210,field: 'driver', filter: true, sortable: true, enableCellChangeFlash:true },
  { headerName: 'Vehículo',width:120, field: 'vehicleName', sortable: true, enableCellChangeFlash:true },
  { headerName: 'Inició', width:115, field: 'startedAt',  
  valueGetter: (params) => {
    if(params && params.node && params.node.data.startAt) {
      if(params.node.data.started){
      return format( fromUnixTime(params.node.data.startedAt.seconds), 'HH:mm a', { locale: esLocale })
    } else {
      return "No"
    }
    }
  }},
  { headerName: 'Finalizó',width:115, field: 'endedAt',
  valueGetter: (params) => {
    if(params && params.node) {
      if (params.node.data.hasEnded) {
      return format( fromUnixTime(params.node.data.endedAt.seconds), 'HH:mm a', { locale: esLocale })
    } else {
      return "No"
    }
    }
  }}
 ];
 export var LiveAsignColumnDef: (ColDef)[] =[
  { headerName: 'Cliente', field: 'customerName',  headerCheckboxSelection: true, 
  headerCheckboxSelectionFilteredOnly: true, filter: true, checkboxSelection: true, sortable: true, enableRowGroup: true },
   { headerName: 'Ruta', field: 'routeName',filter: true, sortable: true,  enableCellChangeFlash:true },
  { headerName: 'Inicia', field: 'stopBeginHour', sortable: true, filter: true
   },
  { headerName: 'Programa / Turno', field: 'round', valueGetter: (params) => {
    if(params && params.node) {     
      return  params.node.data.round + " / " + params.node.data.program
    }
  }},
  { headerName: 'Tipo', field: 'type', sortable: true, enableValue: true, enableCellChangeFlash:true },
  { headerName: 'Conductor', field: 'driver', filter: true, sortable: true, enableCellChangeFlash:true },
  { headerName: 'Vehículo', field: 'vehicleName', sortable: true, enableCellChangeFlash:true }
 ];

  export var LiveProgramColumnDefs = [
    { headerName: 'Conductor', field: 'driver', sortable: true, enableCellChangeFlash:true },
    { headerName: 'Vehículo', field: 'vehicleName', sortable: true, enableCellChangeFlash:true },
    { headerName: 'Cliente', field: 'customerName', sortable: true, enableRowGroup: true },
    { headerName: 'Fecha Inicio', field: 'startAt',
      valueGetter: (params) => {
        if(params && params.node && params.node.data.startAt) {
          return format( fromUnixTime(params.node.data.startAt.seconds), 'MM/dd/yyyy HH:mm', { locale: esLocale })
        }
      }
    },
    { headerName: 'Fecha Fin', field: 'endAt', valueGetter: (params) => {
      if(params && params.node && params.node.data.endAt) {
        return format( fromUnixTime(params.node.data.endAt.seconds), 'MM/dd/yyyy HH:mm', { locale: esLocale })
      }
    }},
    { headerName: '¿Inició?', field: 'started', enableRowGroup: true, enableCellChangeFlash:true, cellRenderer: (params) => { 
      if (params && params.value) {
        return !!params.value ? 'Si':'No'
      }
    }},
    { headerName: 'Inició el', field: 'startedAt', enableCellChangeFlash:true, valueGetter: (params) => {
      if(params && params.node && params.node.data.startedAt) {
        return format( fromUnixTime(params.node.data.startedAt.seconds), 'MM/dd/yyyy HH:mm', { locale: esLocale })
      }
    }},
    { headerName: '¿Finalizó?', field: 'hasEnded', enableCellChangeFlash:true, enableRowGroup: true, cellRenderer: (params) => { 
      if (params && params.value) {
        return !!params.value ? 'Si':'No'
      }
    }},
    { headerName: 'Finalizó el', field: 'endedAt', enableCellChangeFlash:true, valueGetter: (params) => {
      if(params && params.node && params.node.data.endedAt) {
        return format( fromUnixTime(params.node.data.endedAt.seconds), 'MM/dd/yyyy HH:mm', { locale: esLocale })
      }
    }},
    // { headerName: 'Fecha', field: 'created' },
    { headerName: 'Problemas?', field: 'isWithTrouble', enableCellChangeFlash:true, enableRowGroup: true, cellRenderer: (params) => { 
      if (params && params.value) {
        return !!params.value ? 'Si':'No'
      }
    }},
    { headerName: 'Problema', field: 'troubleMessage', sortable: true, enableValue: true, enableCellChangeFlash:true },
    { headerName: 'Tipo de problema', field: 'troubleType', sortable: true, enableValue: true, enableCellChangeFlash:true },
    { headerName: 'Programa', field: 'program', sortable: true, enableValue: true, enableCellChangeFlash:true },
    { headerName: 'Turno', field: 'round', sortable: true, enableRowGroup: true, enableCellChangeFlash:true },
    { headerName: 'Ruta', field: 'routeName', sortable: true, enableRowGroup: true, enableCellChangeFlash:true },
    { headerName: 'Tipo', field: 'type', enableRowGroup: true, enableCellChangeFlash:true },
    { headerName: 'Capacidad', field: 'capacity', enableRowGroup: true },
    { headerName: 'Usuarios', field: 'count', enableRowGroup: true, enableCellChangeFlash:true }
  ]