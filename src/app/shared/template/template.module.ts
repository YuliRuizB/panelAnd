import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared.module';

import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { QuickViewComponent } from './quick-view/quick-view.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FooterComponent } from './footer/footer.component';

import { SideNavDirective } from '../directives/side-nav.directive';
import { ThemeConstantService } from '../services/theme-constant.service';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
    exports: [
        HeaderComponent,
        SearchComponent,
        QuickViewComponent,
        SideNavComponent,
        SideNavDirective,
        FooterComponent,
        TermsComponent,
        PrivacyComponent
    ],
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        HeaderComponent,
        SearchComponent,
        QuickViewComponent,
        SideNavComponent,
        SideNavDirective,
        FooterComponent,
        TermsComponent,
        PrivacyComponent,
        PageNotFoundComponent
    ],
    providers: [
        ThemeConstantService
    ]
})

export class TemplateModule { }
