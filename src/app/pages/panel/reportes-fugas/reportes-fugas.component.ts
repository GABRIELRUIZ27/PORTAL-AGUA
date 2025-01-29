import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ComunidadService } from 'src/app/core/services/comunidad.service';
import { ReporteAguaService } from 'src/app/core/services/reporte-fuga.service';
import { LoadingStates } from 'src/app/global/global';
import { Reporte } from 'src/app/models/reporte';
import * as XLSX from 'xlsx';
import { Comunidad } from 'src/app/models/comunidad';

@Component({
  selector: 'app-reportes-fugas',
  templateUrl: './reportes-fugas.component.html',
  styleUrls: ['./reportes-fugas.component.css']
})
export class ReportesFugasComponent implements OnInit {
  @ViewChild('mapCanvas') mapCanvas!: ElementRef<HTMLElement>;
  @ViewChild('closebutton') closebutton!: ElementRef;
  @ViewChild('ubicacionInput', { static: false }) ubicacionInput!: ElementRef;
  @ViewChild('searchItem') searchItem!: ElementRef;
  reporteForm!: FormGroup;
  isModalAdd = true;
  latitude: number = 19.316818295403003;
  longitude: number = -98.23837658175323;
  canvas!: HTMLElement;
  private map: any;
  private marker: any;
  maps!: google.maps.Map;
  comunidades: Comunidad[] = [];
  Reportes: Reporte[] = [];
  imagenAmpliada: string | null = null;
  isLoading = LoadingStates.neutro;
  id!: number;
  public isUpdatingfoto: boolean = false;
  reportes!: Reporte;
  public isUpdatingImg: boolean = false;
  public imgPreview: string = '';
  totalReportes: number = 0;

  constructor(
    @Inject('CONFIG_PAGINATOR') public configPaginator: PaginationInstance,
    private spinnerService: NgxSpinnerService,
    private mensajeService: MensajeService,
    private formBuilder: FormBuilder,
    private comunidadService: ComunidadService,
    private reportesService: ReporteAguaService
  ) {
    this.getComunidad();
    this.creteForm();
  }

  ngOnInit(): void {
    this.obtenerTotalReportes();
  }

  obtenerTotalReportes(): void {
    this.reportesService.getTotalReportes().subscribe({
      next: (response: number) => {
        this.totalReportes = response; // Asignamos el número recibido al contador
      },
      error: (error) => {
        console.error('Error al obtener el total de reportes:', error);
      },
    });
  }
  
  creteForm() {
    this.reporteForm = this.formBuilder.group({
      id: [null],
      nombre: [''],
      foto: [''],
      telefono: [''],
      direccion: [
        '',
        [
          Validators.required,
        ],
      ],
      imagenBase64: [''],
      latitud: [],
      longitud: [],
      comunidad: ['', Validators.required],
    });
  }

  getComunidad() {
    this.comunidadService
      .getAll()
      .subscribe({ next: (dataFromAPI) => (this.comunidades = dataFromAPI) });
  }

  agregar() {
    if (this.reporteForm.invalid) {
      this.mensajeService.mensajeError('Por favor, completa los campos obligatorios.');
      return;
    }
  
    this.reportes = this.reporteForm.value as Reporte;
  
    // Asegurar que la comunidad seleccionada se asigne correctamente
    const comunidadId = this.reporteForm.get('comunidad')?.value;
    this.reportes.comunidad = { id: comunidadId } as Comunidad;
  
    this.spinnerService.show();
  
    const imagenBase64 = this.reporteForm.get('imagenBase64')?.value;
  
    // Construir los datos del formulario incluyendo la imagen
    let formData = imagenBase64
      ? { ...this.reportes, imagenBase64 }
      : this.reportes;
  
    console.log('Datos enviados:', formData);
  
    // Llamar al servicio para enviar el reporte
    this.reportesService.post(formData).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.mensajeService.mensajeExito('Reporte enviado correctamente');
  
        // Resetear el formulario y cerrar el modal
        this.resetForm();
        const closeButton = document.getElementById('closebutton');
        closeButton?.click();
      },
      error: (error) => {
        this.spinnerService.hide();
        this.mensajeService.mensajeError('Error al enviar el reporte: ' + error.message);
      },
    });
  }  

  mostrarImagenAmpliada(rutaImagen: string) {
    this.imagenAmpliada = rutaImagen;
    const modal = document.getElementById('modal-imagen-ampliada');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.isUpdatingImg = false;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        const base64WithoutPrefix = base64String.split(';base64,').pop() || '';

        this.reporteForm.patchValue({
          imagenBase64: base64WithoutPrefix, // Contiene solo la representación en base64
        });
      };
      this.isUpdatingfoto = false;
      reader.readAsDataURL(file);
    }
  }

  resetForm() {
    this.closebutton.nativeElement.click();
    this.reporteForm.reset();
  }

  resetMap() {
    this.ubicacionInput.nativeElement.value = '';
    this.setCurrentLocation();
    this.ngAfterViewInit();
  }

  handleChangeAdd() {
    if (this.reporteForm) {
      this.reporteForm.reset();
      this.isModalAdd = true;
      this.isUpdatingfoto = false;
      this.isUpdatingImg = false;
    }
  }

  cerrarModal() {
    this.imagenAmpliada = null;
    const modal = document.getElementById('modal-imagen-ampliada');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }

  getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        const geocoder = new google.maps.Geocoder();
        const latLng = new google.maps.LatLng(this.latitude, this.longitude);
        this.adress();
      });
    }
  }
  adress() {
    const geocoder = new google.maps.Geocoder();
    const latLng = new google.maps.LatLng(this.latitude, this.longitude);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results && results[0]) {
          const place = results[0];
          const formattedAddress = place.formatted_address || '';

          if (formattedAddress.toLowerCase().includes('tlax')) {
            if (place.formatted_address) {
              this.reporteForm.patchValue({
                direccion: place.formatted_address,
                domicilio: place.formatted_address,
              });
            } else {
              console.log('No se pudo obtener la dirección.');
            }
            this.selectAddress(place);
          } else {
            window.alert('Por favor, selecciona una dirección en Tlaxcala.');
          }
        } else {
          console.error('No se encontraron resultados de geocodificación.');
        }
      } else {
        console.error(
          'Error en la solicitud de geocodificación inversa:',
          status
        );
      }
    });
  }

  selectAddress(event: any) {
    if (!event || !event.formatted_address) {
      console.error('Evento inválido o sin dirección formateada:', event);
      return;
    }
  
    const formattedAddress = event.formatted_address || '';
    if (formattedAddress.toLowerCase().includes('tlax')) {
      if (!event.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
  
      if (event.formatted_address) {
        this.reporteForm.patchValue({
          domicilio: event.formatted_address,
        });
      }
  
      const selectedLat = event.geometry?.location?.lat() || this.latitude;
      const selectedLng = event.geometry?.location?.lng() || this.longitude;
  
      this.canvas.setAttribute('data-lat', selectedLat.toString());
      this.canvas.setAttribute('data-lng', selectedLng.toString());
      const newLatLng = new google.maps.LatLng(selectedLat, selectedLng);
      this.maps.setCenter(newLatLng);
      this.maps.setZoom(15);
      if (this.marker) {
        this.marker.setMap(null);
      }
      this.marker = new google.maps.Marker({
        position: newLatLng,
        map: this.maps,
        animation: google.maps.Animation.DROP,
        title: event.name,
      });
      this.reporteForm.patchValue({
        longitud: selectedLng,
        latitud: selectedLat,
      });
    } else {
      window.alert('Por favor, selecciona una dirección en Tlaxcala.');
    }
  }
  
  selectAddress2(place: google.maps.places.PlaceResult) {
    const selectedLat = this.reporteForm.value.latitud;
    const selectedLng = this.reporteForm.value.longitud;

    this.canvas.setAttribute('data-lat', selectedLat.toString());
    this.canvas.setAttribute('data-lng', selectedLng.toString());
    const newLatLng = new google.maps.LatLng(selectedLat, selectedLng);
    this.maps.setCenter(newLatLng);
    this.maps.setZoom(15);
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: newLatLng,
      map: this.maps,
      animation: google.maps.Animation.DROP,
      title: this.reporteForm.value.nombres,
    });
  }
  ngAfterViewInit() {
    this.canvas = this.mapCanvas.nativeElement;

    if (!this.canvas) {
      console.error('El elemento del mapa no fue encontrado');
      return;
    }
    const input = this.ubicacionInput.nativeElement;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ['formatted_address', 'geometry', 'name'],
      types: ['geocode'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.selectAddress(place);
    });
    const myLatlng = new google.maps.LatLng(this.latitude, this.longitude);

    const mapOptions = {
      zoom: 13,
      scrollwheel: false,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#444444' }],
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [{ color: '#f2f2f2' }],
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'road',
          elementType: 'all',
          stylers: [{ saturation: -100 }, { lightness: 45 }],
        },
        {
          featureType: 'road.highway',
          elementType: 'all',
          stylers: [{ visibility: 'simplified' }],
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'all',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [{ color: '#0ba4e2' }, { visibility: 'on' }],
        },
      ],
    };

    this.maps = new google.maps.Map(this.canvas, mapOptions);

    google.maps.event.addListener(
      this.maps,
      'click',
      (event: google.maps.KmlMouseEvent) => {
        this.handleMapClick(event);
      }
    );
  }

  handleMapClick(
    event: google.maps.KmlMouseEvent | google.maps.IconMouseEvent
  ) {
    if (event.latLng) {
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();
      this.reporteForm.patchValue({
        latitud: this.latitude,
        longitud: this.longitude,
      });
    } else {
      console.error('No se pudo obtener la posición al hacer clic en el mapa.');
    }
    this.adress();
  }
  onPageChange(number: number) {
    this.configPaginator.currentPage = number;
  }

  mapa() {
    this.setCurrentLocation();
    const dummyPlace: google.maps.places.PlaceResult = {
      geometry: {
        location: new google.maps.LatLng(0, 0),
      },
      formatted_address: '',
      name: '',
    };

    this.selectAddress2(dummyPlace);
  }
}
