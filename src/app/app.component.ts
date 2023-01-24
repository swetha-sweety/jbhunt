import { Component } from "@angular/core";
import * as FileSaver from "file-saver";
import { Product } from "./product";
import { ProductService } from "./product.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  products: Product[] = [];
  search:any;

  selectedProducts: Product[] = [];
  btntoggle: any;
  fileData: any;
  name: any;
  imageFlage: any;
  fileName: any;
  url1: any;
  base64: any;
  ImageData: any;

  constructor(private productService: ProductService) {}

  cols: any[] = [];

  exportColumns: any[] = [];

  ngOnInit() {
    this.productService.getProductsSmall().then(data => (this.products = data));

    this.cols = [
      { field: "code", header: "Code" },
      { field: "name", header: "Name" },
      { field: "category", header: "Category" },
      { field: "quantity", header: "Quantity" },
      { field: "price", header:"price"}
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
  }

  onUploadFile(item: any = []) {
    this.btntoggle = true
    var file = item.target.files[0];
    console.log("first output", file);
    this.name = file.name
    var reader = new FileReader();
    // console.log("second output",reader);
    console.log("third output",reader.readAsDataURL(file));
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.fileData = reader.result;
      // var inputData=reader.result;
      // console.log("fourth output",inputData)
      // this.fileData=inputData;
    }
    // console.log("sixth output",reader.onload)
  }

  onDownloadFile() {
    const downloadLink = document.createElement('a');
    // const fileName = this.name;
    const fileName="image"+".jpg";
    downloadLink.href = this.fileData;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  onSelectFile(event: any) {
    this.btntoggle = true
    if (event.target.files[0].name === null || event.target.files[0].name === undefined) {
        this.imageFlage = false
    }
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    this.fileName = file.name;
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
        return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
}

_handleReaderLoaded(e:any) {
  const reader = e.target;
  this.url1 = reader.result;
  localStorage.setItem("image", this.url1)
  this.base64 = reader.result.substring(reader.result.indexOf(',') + 1);
}

downloadImgFile(){
  const downloadImgLink=document.createElement('a');
  const fileName="task"+".jpg";
  downloadImgLink.href=this.ImageData;
  downloadImgLink.download=fileName;
  downloadImgLink.click();
}

}
// jhjhjhjhjkhjhj

